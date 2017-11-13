"use strict";

//luodaan kartta.
let mymap = L.map('mapid').setView([51.505, -0.09], 13);
L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoiaGlydmVlIiwiYSI6ImNqOXhiNmVuOTRiZG8zM21paXZ2cnBzd3kifQ.HxoMAma8gtOfcfa3-ra26A'
}).addTo(mymap);

/**
 * piirtää kaikki rastien pallot.
 */
function piirraRastit(){
    for (let i of data.rastit) {
        let circle = L.circle(
            [i.lat, i.lon], {
                color: 'red',
                fillColor: '#f03',
                fillOpacity: 0.5,
                radius: 100
            }
        ).addTo(mymap);
        //circle.bindPopup('');
    }

    let marker = L.marker([62.2333, 25.7333]).addTo(mymap);
}

// tänne on tallennettu kaikki reitii.
let lines = {};

/**
 * lisää kuljetun reitin "tavara" id:isen joukkueen perusteella.
 * @param tavara joukkueen id jonka reitti lisätään.
 */
function piirraReitti(tavara){
    let joukkue = document.getElementById(tavara);
    let koords = [];
    let rastit = {};
    for (let i of data.joukkueet)
        if (i.nimi===tavara) {
            rastit = i.rastit;
        }

    rastit.sort(function (a, b){
        return a.aika>b.aika;
    });

    for (let joukkueRasti of rastit) {
        for (let rasti of data.rastit)
         if (joukkueRasti.id.toString() === rasti.id.toString()){
            koords.push([parseFloat(rasti.lat),parseFloat(rasti.lon)]);
         }
    }

    let polyline = L.polyline(koords, {color: joukkue.style.backgroundColor}).addTo(mymap);
    lines[tavara]=polyline;
}

/**
 * poistaa reitin
 * @param tavara joukkueen id jonka reitti poistetaan.
 */
function removeRoute(tavara){
    mymap.removeLayer(lines[tavara]);
}