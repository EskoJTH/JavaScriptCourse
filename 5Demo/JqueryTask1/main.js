/*
import "pro4leaflet";
import * as L from "leaflet-mml-layers";
 */
"use strict";

/*
$.get( "myhtmlpage.html", myCallBack );
$.get( "myhtmlpage.html", function() {

    myCallBack( param1, param2 );

})
 */
/*
$( document ).ready(function() {


    $( "a" ).click(function( event ) {

        alert( "Cats! Ninjas! And ... Oniooons!!!" );
        event.preventDefault();

    })
        .addClass( "kissa" );
});
*/



window.onload = function() {

    require("proj4leaflet");
    var L = require("leaflet-mml-layers");

    var div = $("#map");
    div.css("width", Math.round(window.innerWidth) + "px");
    div.css("height", Math.round(window.innerHeight) + "px");

    document.body.appendChild(div);

    let mymap = new L.map('map', {
        crs: L.TileLayer.MML.get3067Proj()
    }).setView([62.2333, 25.7333], 11);
    L.tileLayer.mml_wmts({ layer: "maastokartta" }).addTo(mymap);

    var circle = L.circle(
        [62.2325, 25.7355], {
            color: 'red',
            fillColor: '#f03',
            fillOpacity: 0.5,
            radius: 100
        }
    ).addTo(mymap);

    circle.bindPopup('Jiihaa!');

    let marker = L.marker([62.2333, 25.7333]).addTo(mymap);

    let koords = [[62.2325, 25.7355],[62.2333,25.7333],[62.23, 25.73],[62.232, 25.7222]];
    let polyline = L.polyline(koords, {color: 'blue'}).addTo(mymap);


    marker.bindPopup("Paikka : " + marker.getLatLng() + "").openPopup();
};


$( document ).ready(function() {

});

