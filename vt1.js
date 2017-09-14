// Kirjoita tänne oma ohjelmakoodisi

// data-muuttuja sisältää taso 1 vaatimat tiedot. Tasoilla 3 ja 5 tarvitaan myös tupa-muuttujan tietoja.

// voit tutkia tarkemmin käsiteltäviä tietorakenteita konsolin kautta
// tai json-editorin kautta osoitteessa http://jsoneditoronline.org/
// Jos käytät json-editoria niin avaa datat osoitteista:
// http://appro.mit.jyu.fi/tiea2120/vt/vt1/data.json
// http://appro.mit.jyu.fi/tiea2120/vt/vt1/tupa.json

/**
 * Esko Hanell
 * 11.9.2017
 */

"use strict";

/**
 * Tulostaa kaikkien joukkueiden nimet.
 */
function tulosta() {
    for (let i of data.joukkueet) {
        console.log(i.nimi);
    }
}

/**
 * Tulostaa kaikki Joukkue Oliot.
 */
function tulostakaikki() {
    for (let i of data.joukkueet) {
        console.log(i);
    }
}

/**
 * Lisää dataan joukkueen
 * @param joukkue joukkue joka lisätään
 */
function lisaa(joukkue) {
    data.joukkueet.push(joukkue);
}

/**
 * Tulostaa kaikki rastien koodit joilla rastin koodin ensimmäinen merkki on luku.
 */
function tulostarastit() {
    let strinki = "";
    for (let i of data.rastit) {
        if (Number.isInteger(parseInt(i.koodi.charAt(0))))
            strinki += i.koodi + " ";
    }
    console.log(strinki.trim());
}

/**
 * Tulostaa nimien mukaan järjestyksessä joukkueiden nimet ja pisteet.
 */
function tulostaNimiJarjestyksessa() {
    let mappi = [];
    let nimet = [];

    for (let i of data.joukkueet) {
        mappi.push(iteroi(i));
        nimet.push(i.nimi);
    }
    nimet.sort();
    for (let i of nimet) {
        for (let ii of mappi) {
            if (ii.nimi === i)
                console.log(ii.nimi + "   Pisteet->" + ii.pisteet);
        }
    }
}

/**
 * Tulostaa pisteiden ja ajan mukaan järjestyksessä nimet pisteet ajan ja matkan.
 */
function tulostaPisteAikaJarjestuksessa() {
    let mappi = [];
    let used = [];
    for (let i of data.joukkueet) {
        mappi.push(iteroi(i));
    }
    for (let alkio in mappi) {
        let paras = max(mappi, used);
        console.log(paras.nimi + "   Pisteet->" + paras.pisteet + "   Aika->" + paras.aika.getUTCHours() + ":" + paras.aika.getUTCMinutes() + ":" + paras.aika.getUTCSeconds() + "   Matka->" + paras.matka);
        used.push(paras);
    }

}

/**
 * Etsii parhaan joukkueen listasta mappi painottaen pisteitä ja sitten aikaa. used listassa olevia alkioita ei oteta mukaan laskuihin.
 * @param mappi Sisältää läjän joukkueita joulla on nimi pisteet aika ja matka.
 * @param used lista edeltävän kaltaisia joukkueita joita ei huomioida edellisestä listasta.
 * @returns {*} joukkueen jolla parhaat pisteet ja aika.
 */
function max(mappi, used) {
    let suurin;
    let isUsed = false;
    for (let i = 0; i < mappi.length; i++) {
        if ((suurin === undefined) || (((mappi[i].pisteet > suurin.pisteet)) || ((mappi[i].pisteet === suurin.pisteet) && (Date.parse(mappi[i].aika) < Date.parse(suurin.aika))))) {//katsotaan onko tämänhetkinen mappi[i] kelpaava ehdokas.
            for (let ii of used) {//katsotaan onko tarkasteltava jo used listassa. Jos on niin ei aseteta suurimmaksi
                if ((ii.nimi === mappi[i].nimi)) {
                    isUsed = true;
                }
            }
            if (!isUsed) {
                suurin = mappi[i];//asetetaan tämänhetkinen paras ehdokas.
            }
            isUsed = false;//palautetaan vakio asetukset.

        }
    }
    return suurin;
}

/**
 * Aloittaa JSON tiedostosta tarvittavan datan etsimisen ja pilkkomisen. Näyttää pahalta, mutta parempiakaan tapoja tämän suorittamiseen javaScriptillä ei ole neuvvottu.
 * Iffejä on paljon mutta ne ovat samassa paikassa joten koodia ei tarvitse ehkä selata niin paljoa ympäriinsä asioiden selvittämiseksi.
 * Etsii datasta joukkuekohtaisen nimen, pisteet, suoritusajan ja laskee matkan.
 * @param joukkue data.joukkue jonka tiedot etsitään.
 * @returns {{}} palauttaa datan jolla on nimi, pisteet, aika ja matka lajiteltu JSON tiedostosta
 */
function iteroi(joukkue) {
    let ryhma = {}; //tähän tallennetaan alle kaikki palautettavat tiedot ja se myöhemmin palautetaan.
    ryhma.nimi = joukkue.nimi;
    ryhma.pisteet = 0;
    ryhma.matka = 0;
    let loppuaika = Date.parse(joukkue.last);
    let pieninAika = loppuaika; //tähän etsitään pienin aika jotta saadaan selvitettyä kauanko koko suoritukseen kului aikaa.

    let aikaPaikka = []; //tähän tulee tupa.tupa taulusta joukkueen kaikki suoritukset.

    //Nuolenpääkirjoitusta mutta ei JavaScriptissä kai varsinaisesti ole olioitakaan.
    //Suunnilleen puolet asioista vain varmistelee ettei joku datatyyppi ole vahingossa väärä.
    for (let i in tupa.joukkueen_id) {
        if (parseInt(joukkue.id) === parseInt(tupa.joukkueen_id[i])) //tarkastetaan että meillä on oikea id. Tämänkin olisi varmaan voinut aikaisemmin mapata tehokkaammaksi. Paitsi että virheen tarkastukset pitää ilmeisesti silti aina tehdä.
        {
            for (let ii of tupa.tupa) {
                if (parseInt(i) === parseInt(ii.j)) ///tarkastetaan ettei tule "tyyppivirheitä"
                {
                    aikaPaikka.push(ii);//Sijoittaa joukkueen tuvan aikaPaikka tauluun.
                    if (pieninAika > Date.parse(ii.a))
                        pieninAika = Date.parse(ii.a);

                    for (let iii of data.rastit) {
                        if (parseInt(tupa.rastin_id[ii.r]) === parseInt(iii.id)) //tarkastetaan ettei tule "tyyppivirheitä"
                        {
                            if (Number.isInteger(parseInt(iii.koodi.charAt(0))))
                                ryhma.pisteet += parseInt(iii.koodi.charAt(0)); //lisätään rastin id:ssä kerrottu määrä pisteitä joukkueelle.
                        }
                    }
                }
            }
        }
    }
    //Teen seuraavaksi 2 mappia joissa on suoraan id ja sitä vastaava koordinaatti arvo.
    //Luotu täällä toiston vähentämiseksi.
    //Alkuperöinen tarkoitus oli vähentää mapin epätehokasta läpiläymistä yksi arvo kerrallaan.
    //Myöhemmin tajusin että en ole täysin varma että JavaScript osaa hyödyntää mappeja oikein mutta sen voisi tarvittaessa korjata.
    //Joudun tarkistamaan aina kaiken tyypin manuaalisesti joten tästä ei ollut JavaScriptin kanssa mitään hyötyä... En pidä tästä kieliestä yhtään.
    //Tein erikseen mapit pituus ja leveys koordiaateille koska debuggaus vaiheessa oli epäselvyyttä JavaScriptin ja tuplejen toiminnasta.
    //Kahden taulukon käyttö laskee tehokkuutta hieman mutta ei pitäisi olla kovin merkityksellistä lopulta.
    let rastitLon = {};// näitten pitäs oikeestaan olla luotu julkisina consteina mutta hei.
    let rastitLat = {};
    for (let i of data.rastit) {//Koordinaatit sijoitetaan mappeihin.
        rastitLon[(i.id)] = parseFloat(i.lon);
        rastitLat[(i.id)] = parseFloat(i.lat);
    }
    ryhma.matka = laskeMatka(aikaPaikka, rastitLon, rastitLat); //Laskee Matkan koordinaattipisteiden välillä.
    ryhma.aika = new Date(loppuaika - pieninAika); //Laskee kokonaissuoritukseen kuluneen ajan.
    return ryhma;
}

/**
 * Laskee Matkat listLon ja listLat mapeissa olevia koordinaattipisteitä vastaaville sijainneille aikaPaikassa oleville pisteillä.
 * aikaPaikan ei tarvite olla etukäteen minkäänlaisessa järjestyksessä vaan se järjestetään siinä olevien aikojen mukaan tässä funktiossa.
 * lostLon ja lostLan tuodaan ulkoa toiston vähentämiseksi.
 * @param aikaPaikka Joukkuetta vastaavat suoritetut rastit.
 * @param listLon Rasteja vastaavat pituuskoordinaatit mapattuna rastejen ID:hin
 * @param listLat Rasteja vastaavat leveyskoordinaatit mapattuna rastejen ID:hin
 * @returns {number} Palauttaa etäisyyden kaikkien koordinaattien välillä.
 */
function laskeMatka(aikaPaikka, listLon, listLat) {
    let rastitLon = listLon;
    let rastitLat = listLat;
    if (aikaPaikka.length === 0) return 0; //jos tyhjä mennään takaisin.
    aikaPaikka.sort(compareTime); //järjestää aikaPaikan järjestykeen ajan mukaan.

    //Seuraava on lähes turhaa toistoa jotta ensimmäistä rastia ei tarvitse laskea kahdesti, mutta toimii enkä jaksa korjata nyt kun on tehty.
    for (let i = 0; i < aikaPaikka.length; i++) { //käydään läpi koko aikaPaikka
        let a = parseInt(aikaPaikka[i].r); //aikapaikka sisältää tupa mallisia vekottimia.
        for (let ii in tupa.rastin_id) { //käydään läpi kaikki rastien ID:t jotta saadaan oikeat rastien ID:t. Tietorakenteessa on järkeä...
            if (parseInt(ii) === a) { //tarkastetaan ettei tule tyyppivirheitä
                let b = parseInt(tupa.rastin_id[a]); //Tallennetaan id b:hen.
                for (let iii in rastitLon) { //Käydään läpi kaikki koordinaatit. Molemmat taulut ovat aina samanmittaisia.
                    if (parseInt(iii) === b) { //Tarkastetaan ettei tule tyyppivirheitä.
                        let viimeLon = rastitLon[b]; //id arvot mappaantuvat suoraan koodrinaateiksi
                        let viimeLat = rastitLat[b]; //asetetaan valmiiksi "viime arvot" jotta 1 siirtymä voidaan tehdä nollana. yhteen siirtymään tarvitaan aina 2 pistettä eli 4 koordinaattia.
                        return laskeMatkaApu(aikaPaikka, viimeLon, viimeLat, rastitLon, rastitLat, 1);
                    }
                }
            }
        }
    }
    return 0; //Jos tänne jouduttiin palautetaan 0
}

/**
 * Laskee Matkan Varsinaisesti
 * @param aikaPaikka
 * @param vikaLon "aikaisempi" koordinaatti
 * @param vikaLat "aikaisempi" koordinaatti
 * @param rastitLon pituuskoordinaatit matkan laskemiseen mapattuna rastien id:isiin
 * @param rastitLat leveyskoodinaatit matkan laskemiseen mapattuna rastien id:isiin
 * @param iterator hyppää yli sopimattomista arvoista
 * @returns {number} Ensimmäistä rastia ei tarvitse laskea kahdesti.
 */
function laskeMatkaApu(aikaPaikka, vikaLon, vikaLat, rastitLon, rastitLat, iterator) {
    let viimeLon = vikaLon;
    let viimeLat = vikaLat;
    let d = 0;
    for (let i = 1 + iterator; i < aikaPaikka.length; i++) { //käy läpi kaikki tupa.tupa oliot joissa on ajat ja rastit joita tarvitaan.
        let a = parseInt(aikaPaikka[i].r); //joku rastin id
        for (let ii in tupa.rastin_id) { //lisää rastin id:iden varmistelua.
            if (parseInt(ii) === a) { //Tarkastetaan ettei tule "tyyppivirheitä".
                let b = parseInt(tupa.rastin_id[a]); // otetaan talteen oikea rastin id
                for (let iii in rastitLon) { //käydään kaikki  koordinaatit läpi
                    if (parseInt(iii) === b) { //Tarkastetaan ettei tule "tyyppivirheitä".
                        let lon = rastitLon[b]; //id arvot mappaantuvat suoraan koodrinaateiksi
                        let lat = rastitLat[b]; //id arvot mappaantuvat suoraan koodrinaateiksi

                        //console.log(viimeLon, viimeLat);
                        b = getDistanceFromLatLonInKm(lat, lon, viimeLat, viimeLon); //Tommin koordinaatti laskut.
                        d += b;
                        viimeLon = lon; //asetetaan tämänhetkiset koordinaatit seuraavaa kierrosta varten viime koordinaateiksi.
                        viimeLat = lat;
                        break; // lopetetaan läpikäynti kun id oli sopiva, jotta ei lasketa samaa pistettä montaa kertaa.
                    }
                }
                break; // lopetetaan läpikäynti kun id oli sopiva, jotta ei lasketa samaa pistettä montaa kertaa.
            }
        }
    }
    return d; //palautetaan matka.
}

/**
 * vertaillaan khta aikaa ja pistetään ne suuruus järjestykseen.
 * @param a eka aika
 * @param b toinen aika
 * @returns {number} 1 jos järjestys käännettävä 0 jos samat -1 jos järjestys oikein päin. Jos muistan oikein.
 */
function compareTime(a, b) {
    return Date.parse(a.a) - Date.parse(b.a);
}

//Lahtosen Tommin Laskut
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    let R = 6371; // Radius of the earth in km
    let dLat = deg2rad(lat2 - lat1);  // deg2rad below
    let dLon = deg2rad(lon2 - lon1);
    let a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    let d = R * c; // Distance in km
    return d;
}

//Lahtosen Tommin Laskut
function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

/**
 * poistaa yhden joukkueen.
 * @param tama poistettavan joukkueen nimi.
 */
function poista(tama) {
    let n = 0;
    for (let i of data.joukkueet) {
        if (i.nimi === tama) {
            data.joukkueet.splice(n, 1);
        }
        n++;
    }
}

//FunktioKutsut alkavat tästä.

tulosta();

lisaa({
    "nimi": "Mallijoukkue",
    "last": "2017-09-01 10:00:00",
    "jasenet": [
        "Tommi Lahtonen",
        "Matti Meikäläinen"
    ],
    "sarja": 5639189416640512,
    "seura": null,
    "id": 99999
});

tulostakaikki();

tulostarastit();

poista("Vara 1");
poista("Vara 2");
poista("Tollot");

tulostaNimiJarjestyksessa();
tulostaPisteAikaJarjestuksessa();
