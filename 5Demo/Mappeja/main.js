"use strict";

/**
 * latauksen yhteydessä suoritettavat funktiot.
 * Kannattaa katsoa tarkemmin yksitttäisten metodien dokumentaatiota jos tarkempi ymmärrys on tarpeen.
 */
window.onload = function () {
    piirraRastit();
    mymap.setView(new L.LatLng(62.12000, 25.65000), 11);
    listaa();
    let dropTarget1 = document.getElementById("joukkueLista");
    let dropTarget2 = document.getElementById("karttaLista");
    dropTarget2.addEventListener("dragover", dragging );
    dropTarget1.addEventListener("dragover", dragging );
    dropTarget2.addEventListener("drop", droppingAddRoute);
    dropTarget1.addEventListener("drop", dropping);
};

/**
 * eventti draggauselle.
 * @param e drag eventti.
 */
function dragging(e) {
    e.preventDefault();
    // Set the dropEffect to move
    e.dataTransfer.dropEffect = "move"

}

/**
 * eventti draggauselle.
 * @param e drag eventti.
 */
function droppingAddRoute(e){
    e.preventDefault();
    let tavara = e.dataTransfer.getData("text");
    // lisätään tämän elementin sisään
    if (e.target.id === "karttaLista")
        $(e.target).prepend(document.getElementById(tavara));
    else if (e.target.parentNode.id === "karttaLista")
        $(e.target.parentNode).prepend(document.getElementById(tavara));

    piirraReitti(tavara);
}

/**
 * eventti draggauselle.
 * @param e drag eventti.
 */
function dropping(e) {
    e.preventDefault();
    let tavara = e.dataTransfer.getData("text");
    // lisätään tämän elementin sisään
    if (e.target.id === "karttaLista" || e.target.id === "joukkueLista")
        e.target.appendChild(document.getElementById(tavara));
    else if (e.target.parentNode.id === "karttaLista" || e.target.parentNode.id === "joukkueLista")
        e.target.parentNode.appendChild(document.getElementById(tavara));
    removeRoute(tavara);
}

/**
 * luo värillisen listan joukkueiden nimistä.
 */
function listaa() {
    let joukkueLista = document.getElementById("joukkueLista");
    $.getJSON('data.json', function (data) {
        for (let i = 0; i < data.joukkueet.length; i++) {
            let elem = data.joukkueet[i];
            let joukkue = document.createElement("li");
            joukkue.style.backgroundColor = Rainbow(i);
            joukkue.textContent = elem.nimi;
            joukkue.id = elem.nimi;
            joukkueLista.appendChild(joukkue);
            joukkue.setAttribute("draggable", "true");
            joukkue.addEventListener("dragstart", function (e) {
                // raahataan datana elementin textContent-attribuutin arvo
                e.dataTransfer.setData("text/plain", joukkue.id);
                e.dataTransfer.effectAllowed = "move";
            });
        }
    });

}

/**
 * generoi värejä n:ään perustuen.
 * @param n jokin kokonaisluku jota käytetääb värin generoimiseen.
 * @returns {string} värin
 * @constructor
 */
function Rainbow(n) {
    return "hsl(" + n * 20 + ",100%,50%)";
}
