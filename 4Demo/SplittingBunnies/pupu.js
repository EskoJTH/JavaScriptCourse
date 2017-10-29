"use strict";


let bunnyCanvas;
let bunnyContext;
let bunnyImg;

let owlCanvas;
let owlContext;
let owlImg;
let owlLocation = {};
owlLocation.x = 0;
owlLocation.y = 0;

window.onload = function() {
    addBeams(20, 0);
};

/**
 * Does What the name says
 * @param n How many beams to be added
 * @param delay intended for recursion should be given 0
 */
function addBeams(n,delay) {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    let image = document.createElement("img");
    canvas.appendChild(image);
    canvas.className = "palkit";
    image.src = "palikka.svg";
    canvas.style.animationDelay = (delay * 200).toString() + "ms";
    document.body.appendChild(canvas);
    image.top = "-100px";
    context.drawImage(image, 0, 0);
    if (n>0) addBeams(n-1,delay+1);
}

function drawInitBunnyRight() {
    bunnyCanvas = document.getElementById("rightBunnyCanvas");
    bunnyContext = bunnyCanvas.getContext("2d");
    bunnyImg = document.getElementById("bunny1");
    bunnyContext.drawImage(bunnyImg, 0, 0);
}

function drawInitBunnyLeft() {
    bunnyCanvas = document.getElementById("leftBunnyCanvas");
    bunnyContext = bunnyCanvas.getContext("2d");
    bunnyImg = document.getElementById("bunny2");
    bunnyContext.drawImage(bunnyImg, -192, 0);
}

function drawInitOwl() {
    owlCanvas = document.getElementById("owlCanvas");
    owlContext = owlCanvas.getContext("2d");
    owlImg = document.getElementById("owl");
    owlContext.drawImage(owlImg, 0, 0);
}
