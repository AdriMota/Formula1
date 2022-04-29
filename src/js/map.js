import * as d3 from 'd3'
import { json } from 'd3-fetch'
import L, { marker } from 'leaflet'
import { state } from './state.js';
import circuitsLayout from '../lib/circuitsLayout.json';
import { getCircuits, getAccidents, getCollisions } from '../api.js';
import { count } from 'd3';

//const URL_TRACKS = 'https://ergast.com/api/f1/2021/circuits.json?limit=100';

/* ----------------------------------------------------------------------------------
    MAP
-----------------------------------------------------------------------------------*/
const map = L.map('map').setView([15, 0], 2) //15, 0, 3

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    minZoom: 2,
    maxZoom: 17
}).addTo(map);


/* ----------------------------------------------------------------------------------
    CIRCUITS
-----------------------------------------------------------------------------------*/
let circuits;

// Charge la liste des circuits
async function renderCircuits() {
    circuits = await getCircuits()
    //console.log(circuits);

    // Récupérer la latitude et la longitude des circuits
    for (const circuit of circuits) {
        const lat = circuit.Location.lat;
        const long = circuit.Location.long;

        // Dessiner un cercle par location du circuit
        drawCircle(lat, long, 1);
    }
}

renderCircuits()

// Charge la liste des circuits
async function deleteCircuits() {
    const circuits = await getCircuits()

    // Récupérer la latitude et la longitude des circuits
    for (const circuit of circuits) {
        // Supprimer les cercles des années précédentes
        deleteCircles(circuit);
    }
}


/* ----------------------------------------------------------------------------------
    ACCIDENTS
-----------------------------------------------------------------------------------*/
let mapAccidents = new Map();

async function renderAccidents() {
    mapAccidents = new Map();

    const accidents = await getAccidents();
    const collisions = await getCollisions();

    let cmptAccidents = 0;
    
    for (const accident of [...accidents, ...collisions]) {
        //console.log(accident.Circuit.Location);

        if (mapAccidents.has(accident.Circuit.circuitId)) {
            const res = mapAccidents.get(accident.Circuit.circuitId);
            res.count += accident.Results.length;
        } else {
            mapAccidents.set(accident.Circuit.circuitId, {
                id: accident.Circuit.circuitId,
                lat: accident.Circuit.Location.lat,
                long: accident.Circuit.Location.long,
                count: accident.Results.length
            });
        }

        //console.log(accident.Circuit.circuitId, ' : ', accident.Results.length);
        if (accident.Results.length > 0) cmptAccidents += accident.Results.length;
    }

    //console.log(mapAccidents);

    // Total des accidents + collisions
    //console.log("Accidents totaux : " + cmptAccidents);
    getAccidentsQty()
}

renderAccidents()

// Récupérer le nombre d'accidents
function getAccidentsQty() {    
    // Détermine le plus grand nombre d'accidents parmis tous les circuits de l'année
    let nbAccidents = 0;

    //console.log(mapAccidents);
    
    for (const [key, value] of mapAccidents.entries()) {
        //console.log(key, value);
        //console.log(key, value.lat, value.long, value.count);

        if (value.count > nbAccidents) nbAccidents = value.count;
        //console.log("Biggest value = ", nbAccidents); 
    }

    for (const [key, value] of mapAccidents.entries()) {
        const accidents = 1 - (value.count / nbAccidents);
        
        // L'objectif est de dessiner des cerles allant de rouge à vert 
        // en fonction du nombre d'accidents sur la piste pour l'année en question.
        drawCircle(value.lat, value.long, accidents);
    }
    
}

export { renderCircuits, deleteCircuits, renderAccidents }

/* ----------------------------------------------------------------------------------
    CERCLES
-----------------------------------------------------------------------------------*/
let circles = [];

// Dessiner un cercle
function drawCircle(lat, long, accidents) {
    let circle = L.circleMarker([lat, long], {
        color: d3.interpolateRdYlGn(accidents),
        fillColor: d3.interpolateRdYlGn(accidents),
        radius: 6
    }).addTo(map).on('click', clickOnMarker);

    circles.push(circle);
}

// Supprimer les cercles
function deleteCircles() {
    for (const circle of circles) {
        map.removeLayer(circle);
    }

    circles = [];
}


/* ----------------------------------------------------------------------------------
    TRACÉ
-----------------------------------------------------------------------------------*/
// Dessiner le tracé des circuits
map.on('moveend', function() {
    //console.log(map.getZoom());
    
    // Si ce n'est pas assez zoomé
    if (map.getZoom() < 12) {
        // Supprimer le tracé du circuit
        map.eachLayer(function(layer) { 
            if (layer instanceof L.GeoJSON) {
                map.removeLayer(layer);
            }
        });

        // Afficher les markeurs (les cercles)
        //circle.addTo(map);
    }

    // Si c'est très zoomé
    if (map.getZoom() >= 12) {
        // Affiche le tracé du circuit
        let circuitForm = L.geoJSON(
            circuitsLayout, { 
                style: {
                    "color": '#f4f4f4',
                    "fillOpacity": 0.6,
                    "weight": 6
                }
            }
        )
        circuitForm.addTo(map);

        // Cacher les markeurs (les cercles)
        //map.removeLayer(circle);
    }
})


/* ----------------------------------------------------------------------------------
    POPUP
-----------------------------------------------------------------------------------*/
// Afficher la popup
function clickOnMarker() {
    console.log("Cercle cliqué");

    document.getElementById("popup").style.visibility = "visible";

    //console.log(circuits);
    
    /* let popup = document.getElementById("popup");
    
    if (popup.style.visibility === "visible") {
        popup.style.visibility = "hidden";
    } else {
        popup.style.visibility = "visible";
    } */
}

// Cacher la popup
/* map.on('click', function() {
    document.getElementById("popup").style.visibility = "hidden";

    console.log("Map cliquée"); 
}) */