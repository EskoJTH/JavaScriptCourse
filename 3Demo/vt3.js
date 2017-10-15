// data-muuttuja sisältää kaiken tarvittavan ja on rakenteeltaan lähes samankaltainen kuin viikkotehtävässä 2
// Rastileimaukset on siirretty tupa-rakenteesta suoraan jokaisen joukkueen yhteyteen
//
// voit tutkia tarkemmin käsiteltävää tietorakennetta konsolin kautta 
// tai json-editorin kautta osoitteessa http://jsoneditoronline.org/
// Jos käytät json-editoria niin avaa data osoitteesta:
// http://appro.mit.jyu.fi/tiea2120/vt/vt3/data.json

"use strict";
//aliohjelma joka lisää: nameCheck()
let jasentenNimet = [];

//aliohjelma joka lisää: leimausValidate()
let leimausTavat = [];
console.log(data);

window.onload = function () {
    joukkueValidateLite();
    loadRastit();
    nameCheckLite();
    showJoukkue();
}

/**
 * Kahta samannimistä joukkuetta ei saa tallentaa tietorakenteeseen setCustomValidity()
 * Joukkueen jäsenen nimi ei saa olla tyhjä
 * Joukkueelle on keksittävä automaattisesti id
 * Jäseniä on syötettävä vähintään kaksi setCustomValidity()
 */

function nameCheckLite() {
    let nameBoxes = document.getElementsByClassName("rightBoxName");
    let nimet = [];
    for (let i of nameBoxes) {
        if (i.value || i.value.toString().trim() !== "") nimet.push(i.value);
    }
    if (nimet.length < 2) {
        for (let i of nameBoxes) {
            i.setCustomValidity("Ei ole tarpeeksi jäseniä joukkueeksi.");
        }
        return false;
    }
    for (let i of nameBoxes) {
        i.setCustomValidity("");
    }
    return true;
}

function nameCheck() {
    let nameBoxes = document.getElementsByClassName("rightBoxName");
    let nimet = [];
    for (let i of nameBoxes) {
        if (i.value || i.value.toString().trim() !== "") nimet.push(i.value);
    }
    if (nimet.length < 2) {
        for (let i of nameBoxes) {
            i.setCustomValidity("Ei ole tarpeeksi jäseniä joukkueeksi.");
            i.reportValidity();
        }
        return false;
    }
    jasentenNimet = nimet;
    for (let i of nameBoxes) {
        i.setCustomValidity("");
    }
    return true;
}

/**
 * onnistuu vain kun nimet sopivia (validoitu etukäteen?)
 * lopussa oleva listaus joukkueista päivitettävä
 * joukkue lisättävä dataan.
 */
function buttonClick() {
    let bool1 = leimausValidate();
    let bool2 = joukkueValidate();
    let bool3 = nameCheck();
    let bool4 = pvmValidate();
    let timeElem = document.getElementById("jLuotiaika");
    let nimi = document.getElementById("jNimi");
    if (bool1 && bool2 && bool3 && bool4) {
        data.joukkueet.push({
            "nimi": nimi.value,
            "jasenet": jasentenNimet.join(", "),
            "sarja": getSarja(),
            "seura": "",
            "id": getID(),
            "rastit": "",
            "pisteet": "",
            "matka": "",
            "leimaustapa": leimausTavat.join(", "),
            "luontiaika": timeElem.value
        });
        let vanhalista = document.getElementById("joukkueLista");
        vanhalista.parentNode.removeChild(vanhalista);
        showJoukkue();
    }
}

function getSarja() {
    let list = document.getElementsByClassName("sarjaRadio");
    for (i of list) {
        if (i.checked) return i.id;
    }
}

function getID() {
    let id = Math.floor(4294967295 * Math.Random);
    for (let i of data.joukkueet) {
        if (i.id === id) {
            return getID();
        }
    }
    return id;
}

function pvmValidate() {
    let timeElem = document.getElementById("jLuotiaika");
    return timeElem.validity.valid;
}

function joukkueValidate() {
    let nimi = document.getElementById("jNimi");
    if (!nimi.value || nimi.value.toString().trim() === "") {
        nimi.setCustomValidity("Tyhjä ei kelpaa nimeksi");
        nimi.reportValidity();
        return false;
    }
    if (tarkistOnkoTupla(nimi)) {
        nimi.setCustomValidity("Nimi on jo olemassa");
        nimi.reportValidity();
        return false;

    }

    nimi.setCustomValidity("");
    return true;

}

function joukkueValidateLite() {
    let nimi = document.getElementById("jNimi");
    if (!nimi.value || nimi.value.toString().trim() === "") {
        nimi.setCustomValidity("Tyhjä ei kelpaa nimeksi");
        return false;
    }
    if (tarkistOnkoTupla(nimi)) {
        nimi.setCustomValidity("Nimi on jo olemassa");
        return false;

    }

        nimi.setCustomValidity("");
        return true;

}

/**
 * tarkastaa onko jo olemassa saman niminen joukkue kuin annetulla Elementillä.
 * @param element elementti jonka valueta verrataan.
 * @returns {boolean} löytyikö?
 */
function tarkistOnkoTupla(element) {
    for (let i of data.joukkueet) {
        if (element.value) {
            if (element.value.toString().trim() === i.nimi.toString().trim()) return true;
        }
    }
    return false;
}

/**
 * Leimaustapoja on valittava vähintään yksi
 */
function leimausValidate() {
    let checkBoxes = document.getElementsByClassName("checkboxes");
    for (let i of checkBoxes) {
        if (i.checked) {
            leimausTavat.push(i.parentNode.textContent);
            for (let i of checkBoxes) {
                i.setCustomValidity("");
            }
            return true;
        }
    }
    for (let i of checkBoxes) {
        i.setCustomValidity("Yksi Leimaustapa pitää olla valittyna");
        i.reportValidity()
    }
    return false;
}

function loadRastit() {
    let viimeinenElementti = document.getElementById("loppu");
    let eka = true;
    for (let i of data.sarjat) {
        let div = document.createElement("div");

        if (eka) {
            let label = document.createElement("label");
            label.textContent = "Sarjat  ";
            label.alignment = "left";
            div.appendChild(label);
            eka = false;
            div.className = "headerListPadding";
        } else {
            div.className = "listPadding";
        }

        let label = document.createElement("label");
        label.className = "right";
        label.textContent = i.nimi;
        div.appendChild(label);
        let input = document.createElement("input");
        input.id = i.nimi.toString();
        input.name = "sarjat";
        input.type = "radio";
        input.checked = "true";
        input.class = "sarjaRadio";
        label.appendChild(input);
        insertAfter(div, viimeinenElementti);
        viimeinenElementti = div;
    }
}

function insertAfter(newNode, referenceNode) {
    referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
}

function showJoukkue() {
    let field = document.createElement("fieldset");
    field.id = "joukkueLista";
    let legend = document.createElement("legend");
    legend.textContent = "Joukkueiden nimet";
    field.appendChild(legend);
    let ul = document.createElement("ul");
    let lista = [];
    for (let i of data.joukkueet) {
        lista.push(i.nimi);
    }
    lista.sort(lovercaseSort);
    for (let i of lista) {
        let li = document.createElement("li");
        let label = document.createElement("label");
        label.textContent = i.toString();
        li.appendChild(label);
        ul.appendChild(li)
    }
    field.appendChild(ul);
    let last = document.getElementById("tallenna");
    insertAfter(field, last);
}

function lovercaseSort(a,b){
    return a.localeCompare(b, 'fi', {"sensitivity": "base"});
}