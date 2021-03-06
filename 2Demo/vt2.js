// Kirjoita tänne oma ohjelmakoodisi

// data-muuttuja on sama kuin viikkotehtävässä 1.
// tupa-muuttuja on yksinkertaistettu versio viikkotehtävästä 1.
//
// voit tutkia tarkemmin käsiteltäviä tietorakenteita konsolin kautta
// tai json-editorin kautta osoitteessa http://jsoneditoronline.org/
// Jos käytät json-editoria niin avaa datat osoitteista:
// http://appro.mit.jyu.fi/tiea2120/vt/vt2/data.jso2n
// http://appro.mit.jyu.fi/tiea2120/vt/vt2/tupa.json
//
// http://jsoneditoronline.org/?url=http%3A%2F%2Fappro.mit.jyu.fi%2Ftiea2120%2Fvt%2Fvt2%2Fdata.json
// http://jsoneditoronline.org/?url=http%3A%2F%2Fappro.mit.jyu.fi%2Ftiea2120%2Fvt%2Fvt2%2Ftupa.json

"use strict";
//Muuttujia tiedon siirtämiseksi
let ylimaaraisetLuodutInputit = [];
let muokkausmoodi = false;
let editoitavaJoukkue;

/**
 * Tekee seuraavat toimet kun peli käynnistetään.
 */
window.onload = function () {
    document.getElementById("tupa").appendChild(joukkueidenNimet());
    teeJoukkueBoxi();
    lomage();
    rastit();
    //päivittää nappulan näkyvyyden eli alussa vain jättää sen epä painettavaksi.
    updateButtonVisibility()
}

/**
 * poistaa syöttölaatikoita tarkalleen siitä kohtaa mihin niiden määrä vaihelee.
 * olisi voinut tehdä helpomminkin, mutta oli muutama bugi jossakin muualla ja tästä oli muutama eri iteraatio.
 * @param killByFire mitä poistetaan
 */
function poistaKovakoodatustiJustOikeeMaaraSpagettikoodiaKunMikaanEiToimi(killByFire) {
    let loora = document.getElementById("loora2");
    loora.removeChild(killByFire.parentNode.parentNode);
}

/**
 * eventti joka tapahtuu kun annetaan syötettä joohonkin Joukkueen jäseniä lisäävään tekstilaatikkoon.
 * @param e Eventti.
 */
function aktiiviJoukkueLisaantyminen(e) {
    e.preventDefault();
    inputFieldControl();
}

/**
 * poistaa tarvittaessa tyhjiä tai lisää uusia syöttökenttiä joukkueen jäsenille.
 */
function inputFieldControl() {
    updateButtonVisibility();
    let tyhjat = 0;
    let loora = document.getElementById("loora2");
    let inJJasen1 = document.getElementById("inJJasen1").value.toString().trim();
    let inJJasen2 = document.getElementById("inJJasen2").value.toString().trim();
    //lasketaan tyhjien määrä.
    for (let i of ylimaaraisetLuodutInputit) {
        let arvo = i.value;
        arvo = arvo.toString().trim();
        if (arvo === "") {
            tyhjat++;
        }
    }
    //jos tyhjiä on tasan tarkkaan yksi vapaana palataan pois.
    if (tyhjat === 1 && (!(inJJasen1 === "") || !(inJJasen2 === ""))) return;

    let renumbering = false;
    for (let i = 0; i < ylimaaraisetLuodutInputit.length; i++) {
        let arvo = ylimaaraisetLuodutInputit[i].value;
        arvo = arvo.toString().trim();

        if (arvo === "") {

            poistaKovakoodatustiJustOikeeMaaraSpagettikoodiaKunMikaanEiToimi(ylimaaraisetLuodutInputit[i]);
            ylimaaraisetLuodutInputit.splice(i, 1);
            renumbering = true;
            i--;
        }
    }


    if (renumbering) {
        let count = 3;
        for (let i = 0; i < ylimaaraisetLuodutInputit.length; i++) {
            let value = ylimaaraisetLuodutInputit[i].value;
            let newOld = document.createElement("label");
            let newOldIn = document.createElement("input");
            newOld.textContent = "Jäsen" + " " + (count) + " ";
            newOldIn.type = "text";
            newOldIn.value = value;
            newOldIn.addEventListener("input", aktiiviJoukkueLisaantyminen);
            newOld.appendChild(newOldIn);
            ylimaaraisetLuodutInputit[i].parentNode.parentNode.replaceChild(newOld, ylimaaraisetLuodutInputit[i].parentNode);
            ylimaaraisetLuodutInputit[i] = newOldIn;
            count++;
        }
    }

    if (inJJasen1 === "" || inJJasen2 === "") {
        return;
    }

    let newLabel = document.createElement("label");
    let newInput = document.createElement("input");
    let newP = document.createElement("p");
    newLabel.textContent = "Jäsen" + " " + (ylimaaraisetLuodutInputit.length + 3) + " ";
    newInput.type = "text";
    newInput.value = "";
    newInput.addEventListener("input", aktiiviJoukkueLisaantyminen);
    loora.appendChild(newP);
    newP.appendChild(newLabel);
    newLabel.appendChild(newInput);
    ylimaaraisetLuodutInputit.push(newInput);
}

/**
 * tarkastaa pitäisiköä joukkueen lisäys nappulan olla painettavissa ja muuttaa sen tilan sopivaksi.
 */
function updateButtonVisibility() {
    let nappula = document.getElementById("nappula");
    nappula.disabled = !olikoKaikkiVaatimukset();
}

/**
 * tarkastaa nappulan tarvitsemat vaatimukset painamisen mahdollistamista varten.
 * @returns {boolean} palauttaa voidaanko painaa.
 */
function olikoKaikkiVaatimukset() {
    let count = 0;
    let inNimi = document.getElementById("inJNimi");
    let in1 = document.getElementById("inJJasen1");
    let in2 = document.getElementById("inJJasen2");
    if (inNimi.value === "") return false;
    if (!(in1.value === "")) count++;
    if (!(in2.value === "")) count++;
    for (let i of ylimaaraisetLuodutInputit) {
        if (i.value === "") continue;
        count++;
    }
    return (count >= 2);
}

/**
 * lisää annetut tiedot joukkueeksi kun nappulaa painetaan
 * @param e nappulan painamis -eventti
 */
function lisataanUusiJoukkue(e) {
    e.preventDefault();
    let inTaulu = [];

    let jNimi = document.getElementById("inJNimi");
    if (document.getElementById("inJJasen1").value !== "")
        inTaulu.push(document.getElementById("inJJasen1").value);
    if (document.getElementById("inJJasen2").value !== "")
        inTaulu.push(document.getElementById("inJJasen2").value);
    for (let i of ylimaaraisetLuodutInputit) {
        if (i.value !== "")
            inTaulu.push(i.value);

    }
    if (!muokkausmoodi) {
        data.joukkueet.push({
            "nimi": jNimi.value,
            "last": "0000-00-00 00:00:00",
            "jasenet": inTaulu,
            "sarja": 0,
            "seura": null,
            "id": Math.floor(Math.random() * 2147483647)
        });
    } else {
        for (let i of data.joukkueet)
            if (i.id.toString().trim() === editoitavaJoukkue.id.toString().trim()) {
                i.nimi = jNimi.value;
                i.last= editoitavaJoukkue.last;
                i.jasenet= inTaulu;
                i.sarja= editoitavaJoukkue.sarja;
                i.seura= editoitavaJoukkue.seura;
                i.id= editoitavaJoukkue.id;
            }

    }
    muokkausmoodi = false;

    let tupa = document.getElementById("tupa");
    tupa.replaceChild(joukkueidenNimet(), tupa.firstChild);

    for (let i of ylimaaraisetLuodutInputit) {
        i.value = "";
    }

    document.getElementById("inJJasen2").value = "";
    document.getElementById("inJJasen1").value = "";
    jNimi.value = "";
    inputFieldControl();

}

/**
 * Tekee laatikon jolla voi lisätä joukkueita listaukseen
 */
function teeJoukkueBoxi() {

    let formi = document.createElement("form");
    formi.action = "foobar.ei.toimi.example";
    formi.id = "joukkue";
    formi.method = "post";
    let loora1 = document.createElement("fieldset");
    let loora2 = document.createElement("fieldset");
    loora2.id = "loora2";
    let legenda1 = document.createElement("legend");
    let legenda2 = document.createElement("legend");
    let label1 = document.createElement("label");
    let label2 = document.createElement("label");
    let label3 = document.createElement("label");
    let input1 = document.createElement("input");
    let input2 = document.createElement("input");
    let input3 = document.createElement("input");
    let button = document.createElement("Button");

    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let p4 = document.createElement("p");
    label1.textContent = "Nimi ";
    label2.textContent = "Jasen 1 ";
    label3.textContent = "Jasen 2 ";
    button.textContent = "Lisää Joukkue";
    input1.id = "inJNimi";
    input2.id = "inJJasen1";
    input3.id = "inJJasen2";
    button.id = "nappula";
    input1.type = "text";
    input2.type = "text";
    input3.type = "text";
    input1.value = "";
    input2.value = "";
    input3.value = "";
    input1.addEventListener("input", updateButtonVisibility);
    input2.addEventListener("input", aktiiviJoukkueLisaantyminen);
    input3.addEventListener("input", aktiiviJoukkueLisaantyminen);
    button.addEventListener("click", lisataanUusiJoukkue);
    label1.appendChild(input1);
    label2.appendChild(input2);
    label3.appendChild(input3);
    formi.appendChild(loora1);
    loora1.appendChild(legenda1);
    loora1.appendChild(p1);
    p1.appendChild(label1);
    loora1.appendChild(loora2);
    loora2.appendChild(legenda2);
    loora2.appendChild(p2);
    loora2.appendChild(p3);
    p2.appendChild(label2);
    p3.appendChild(label3);

    label1.appendChild(input1);
    label2.appendChild(input3);
    label3.appendChild(input2);


    loora1.appendChild(p4);
    p4.appendChild(button);

    legenda1.textContent = "Uusi joukkue";
    legenda2.textContent = "Jäsenet";

    let headerOver = document.getElementById("joukkue");
    insertAfter(formi, headerOver);
}

/**
 * Lisää uuden rastin nappulan painalluksesta.
 * @param e eventti
 */
function klikkikasittelija(e) {
    e.preventDefault();
    let in1 = document.getElementById("Lat");
    let in2 = document.getElementById("Lon");
    let in3 = document.getElementById("Koodi");

    in1.value = in1.value.trim();
    in2.value = in2.value.trim();
    in3.value = in3.value.trim();

    if ((in1.value.toString() === "") || (in2.value.toString() === "") || (in3.value.toString() === "")) {
        in1.value = "";
        in2.value = "";
        in3.value = "";
        return;
    }

    for (let i of data.rastit) {
        if (i.koodi.toString() === in3.value.toString()) {
            in1.value = "";
            in2.value = "";
            in3.value = "";
            return;
        }
    }

    data.rastit.push({id: "", kilpailu: "", koodi: in3.value, lat: in1.value, lon: in2.value});
    console.log(data.rastit);
    in1.value = "";
    in2.value = "";
    in3.value = "";
    let myNode = document.getElementById("rastit");
    while (myNode.firstChild) myNode.removeChild(myNode.firstChild);
    rastit();
    console.log("pääsit tänne");
}

/**
 * rastien lisäämiseen soveltuva lomake.
 */
function lomage() {
    let kokoBody = document.body.childNodes;
    let viimeNode;
    for (let i of kokoBody) {
        if (i.textContent === "Lisää rasti") viimeNode = i;
    }

    let formi = viimeNode.nextElementSibling;
    let loora = document.createElement("fieldset");
    let legenda = document.createElement("legend");
    let p1 = document.createElement("p");
    let p2 = document.createElement("p");
    let p3 = document.createElement("p");
    let p4 = document.createElement("p");
    let label1 = document.createElement("label");
    let label2 = document.createElement("label");
    let label3 = document.createElement("label");
    let button = document.createElement("button");
    let in1 = document.createElement("input");
    let in2 = document.createElement("input");
    let in3 = document.createElement("input");
    label1.textContent = "Lat";
    label2.textContent = "Lon";
    label3.textContent = "Koodi";
    button.textContent = "Lisää rasti";
    button.setAttribute("name", "rasti");
    button.setAttribute("id", "rasti");

    in1.setAttribute("type", "text");
    in2.setAttribute("type", "text");
    in3.setAttribute("type", "text");
    in1.id = "Lat";
    in2.id = "Lon";
    in3.id = "Koodi";
    label1.appendChild(in1);
    label2.appendChild(in2);
    label3.appendChild(in3);

    legenda.textContent = "Rastin tiedot";
    loora.appendChild(legenda);

    p1.appendChild(label1);
    p2.appendChild(label2);
    p3.appendChild(label3);
    p4.appendChild(button);
    button.addEventListener("click", klikkikasittelija);

    loora.appendChild(p1);
    loora.appendChild(p2);
    loora.appendChild(p3);
    loora.appendChild(p4);

    formi.appendChild(loora);
}

/**
 * listaa joukkueet pisteJärjestykjsessä näkyville.
 * @returns {Element} palauttaa listauksen sisäletävän noden.
 */
function joukkueidenNimet() {

    let taapeli = document.createElement("table");
    let caption = taapeli.createCaption();
    caption.textContent = "Tulokset";
    let otsikkoRivi = taapeli.insertRow();
    let otsikko1 = document.createElement("th");
    let otsikko2 = document.createElement("th");
    otsikko1.textContent = "Joukkue";
    otsikko2.textContent = "Pisteet";
    otsikkoRivi.appendChild(otsikko1);
    otsikkoRivi.appendChild(otsikko2);

    let listaTiedot = [];

    for (let i of data.joukkueet) {
        let p = pisteet(i);
        console.log(i.nimi);
        let tiedot = {"jasenet": i.jasenet, "pisteet": p, "nimi": i.nimi, "id": i.id};
        listaTiedot.push(tiedot);
    }

    listaTiedot.sort(pisteSorter);

    for (let i of listaTiedot) {
        let a = document.createElement("a");
        let brbr = document.createElement("br");
        a.textContent = i.nimi;
        a.href = "javascript:setDataFromJoukkueToBox(" + i.id + ");";
        let row = taapeli.insertRow();
        let td = row.insertCell();

        td.appendChild(a);
        td.appendChild(brbr);
        td.appendChild(document.createTextNode(i.jasenet.join(', ')));
        let td2 = row.insertCell();
        td2.textContent = i.pisteet;
    }
    return taapeli;
}

/**
 * Kutsutaan kun jonkin joukkueen niemä klikataan joukkue listauksessa.
 * Asettaa joukkueen tiedot näkyville ja muokattavaksi uusi joukkue lomakkeelle.
 * @param joukkueID joukkueen Id joka halutaan muokattavaksi.
 */
function setDataFromJoukkueToBox(joukkueID) {
    console.log(joukkueID);
    muokkausmoodi = true;
    let nimi = document.getElementById("inJNimi");
    let area = document.getElementById("joukkue");
    let jasen1 = document.getElementById("inJJasen1");
    let jasen2 = document.getElementById("inJJasen2");

    for (let i of ylimaaraisetLuodutInputit) {
        jasen1.value = "";
        jasen2.value = "";
        i.value = "";
    }
    //poistaa ylimääräiset syöttö laatikot.
    inputFieldControl();
    let joukkue = {};
    for (let i of data.joukkueet) {
        if (i.id.toString().trim() === joukkueID.toString().trim()) {
            joukkue = i;
            console.log(joukkue.id);
        }
    }
    //asetetaan kaikkien näkyville mitä joukkuetta ollaan muokkaamassa.
    editoitavaJoukkue = joukkue;

    area.scrollIntoView();
    nimi.focus();
    nimi.value = joukkue.nimi;
    jasen1.value = joukkue.jasenet[0];
    jasen2.value = joukkue.jasenet[1];

    for (let i = 2; i < joukkue.jasenet.length; i++) {
        let loora = document.getElementById("loora2");
        let newLabel = document.createElement("label");
        let newInput = document.createElement("input");
        let newP = document.createElement("p");
        newLabel.textContent = "Jäsen" + " " + (i + 1) + " ";
        newInput.type = "text";
        newInput.value = joukkue.jasenet[i];
        newInput.addEventListener("input", aktiiviJoukkueLisaantyminen);
        loora.appendChild(newP);
        newP.appendChild(newLabel);
        newLabel.appendChild(newInput);
        ylimaaraisetLuodutInputit.push(newInput);
    }

    //asettaa perään vielä yhden  tyhjän laatikon. Tästä olis voinu tehäd metodin mutta olkoon.
    let loora = document.getElementById("loora2");
    let newLabel = document.createElement("label");
    let newInput = document.createElement("input");
    let newP = document.createElement("p");
    newLabel.textContent = "Jäsen" + " " + (ylimaaraisetLuodutInputit.length + 3) + " ";
    newInput.type = "text";
    newInput.value = "";
    newInput.addEventListener("input", aktiiviJoukkueLisaantyminen);
    loora.appendChild(newP);
    newP.appendChild(newLabel);
    newLabel.appendChild(newInput);
    ylimaaraisetLuodutInputit.push(newInput);
    updateButtonVisibility();
}

/**
 * sorttii pisteitä
 * @param a ensimmäinen joukkueet alkio
 * @param b toinen joukkueet alkio
 * @returns {number} b.pisteet - a.pisteet
 */
function pisteSorter(a, b) {
    return b.pisteet - a.pisteet;
}

/**
 * laskee joukkueen pisteet.
 * @param joukkue joukkue jonka pisteet lasketaan.
 * @returns {number} pisteet.
 */
function pisteet(joukkue) {

    let listaTuvat = [];
    for (let i of tupa) {
        if (joukkue.id === i.j) {
            listaTuvat.push(i);
        }
    }

    let setRastit = new Set([]);
    for (let i of listaTuvat) {
        for (let ii of data.rastit)
            if (parseInt(ii.id) === parseInt(i.r)) {
                setRastit.add(ii.koodi);
            }
    }

    let pojot = 0;
    for (let i of setRastit) {
        if (Number.isInteger(parseInt(i.charAt(0)))) {
            pojot += parseInt(i.charAt(0));
        }
    }
    return pojot;
}

/**
 * Listaa rastit näkyville.
 */
function rastit() {
    let rasti = document.createElement("table");
    rasti.id = "rastit";
    let taapeli = document.createElement("table");
    let otsikkoRivi = taapeli.insertRow();
    let otsikko1 = document.createElement("th");
    let otsikko2 = document.createElement("th");
    let otsikko3 = document.createElement("th");
    otsikko1.textContent = "Koodi";
    otsikko2.textContent = "Lat";
    otsikko3.textContent = "Lon";
    otsikkoRivi.appendChild(otsikko1);
    otsikkoRivi.appendChild(otsikko2);
    otsikkoRivi.appendChild(otsikko3);
    let kokoBody = document.body.childNodes;
    for (let i of kokoBody) {
        if (i.textContent === "Rastit") {
            insertAfter(rasti, i);
        }
    }

    rasti.appendChild(taapeli);

    let tiedot = [];

    for (let i of data.rastit) {
        tiedot.push(i.koodi);
    }

    tiedot.sort();

    for (let i of tiedot) {
        for (let ii of data.rastit) {
            if (i === ii.koodi) {
                let row = taapeli.insertRow();
                let a = row.insertCell();
                let b = row.insertCell();
                let c = row.insertCell();
                a.textContent = i;
                b.textContent = ii.lat;
                c.textContent = ii.lon;
            }
        }
    }
}

/**
 * luo insert after metodin javascript noodille toimii kuten insertBefore mutta asettaa lapsen hostin alle.
 * @param newNode noodi joka lisätään.
 * @param referenceNode noodi jonka alle lisätään
 */
function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}
