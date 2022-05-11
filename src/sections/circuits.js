//import mapAccidents from './map.js'
import { state } from '../js/state.js';
import { getAccidents, getCollisions, getDescription, getResults } from '../api.js';

/* ----------------------------------------------------------------------------------
    ACCIDENTS
-----------------------------------------------------------------------------------*/
let mapAccidents = new Map();

async function renderTop3() {
    mapAccidents = new Map();

    const accidents = await getAccidents();
    const collisions = await getCollisions();

    let cmptAccidents = 0;

    for (const accident of [...accidents, ...collisions]) {

        if (mapAccidents.has(accident.Circuit.circuitId)) {
            const res = mapAccidents.get(accident.Circuit.circuitId);
            res.count += accident.Results.length;
        } else {
            mapAccidents.set(accident.Circuit.circuitId, {
                count: accident.Results.length,
                id: accident.Circuit.circuitId,
                lat: accident.Circuit.Location.lat,
                long: accident.Circuit.Location.long,
                name: accident.Circuit.circuitName
            });
        }

        if (accident.Results.length > 0) cmptAccidents += accident.Results.length;
    }

    let mapAccidentsSort = [];
    for (const [key, value] of mapAccidents.entries()) {
        mapAccidentsSort.push([value.count, value.id, value.name]);
    }

    mapAccidentsSort.sort(function (a, b) {
        return b[0] - a[0];
    })

    let place = 0;
    for (let i = 0; i <= 2; i++) {
        place++;

        getMap(place)
        
        if(mapAccidentsSort[i]) {
            document.getElementById('circuitName' + place).textContent = mapAccidentsSort[i][2];
        } else {
            document.getElementById('circuitName' + place).textContent = "--";
        }
    }
}

function getMap(place) {

    console.log("circuitLine" + place);

    // DESSINER LA MAP
    // Vérifie si le container est initialisé
    let container = L.DomUtil.get('circuitLine' + place);
        if(container != null){
            container._leaflet_id = null;
    }

    let miniMap = L.map('circuitLine' + place).setView([15, 0], 3) //15, 0, 3

    L.tileLayer('https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png', {
        attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: 'abcd',
        minZoom: 10,
        maxZoom: 12,
    }).addTo(miniMap);

    // AFFICHER LE CIRCUIT

}

let tabFastestCircuits = [];
async function renderFastestCircuits() {
    const results = await getResults();

    tabFastestCircuits = [];
    for (const result of results) {
        const circuitName = result.Circuit.circuitName;
        const circuitURL = result.Circuit.url;

        const tabResults = result.Results;

        let biggestAverageSpeed = 0;
        for (let i = 0; i < tabResults.length; i++) {
            if (biggestAverageSpeed < tabResults[i].FastestLap?.AverageSpeed.speed) {
                biggestAverageSpeed = tabResults[i].FastestLap.AverageSpeed.speed;
            }        
        }
        
        tabFastestCircuits.push([circuitName, biggestAverageSpeed, circuitURL])
    }

    tabFastestCircuits.sort(function (a, b) {
        return b[1] - a[1];
    })

    getCircuitRow(tabFastestCircuits)
}

async function getCircuitRow(tabFastestCircuits) {

    if(state.yearSelected > 2003) {  
        for (let i = 0; i <= 2; i++) {
        
            let circuitName = tabFastestCircuits[i][0];
            let speed = tabFastestCircuits[i][1];
            let circuitURL = tabFastestCircuits[i][2];
            let place = i + 1;
    
            const description = await getDescription(circuitURL, place);
    
            // Crée une ligne dans le tableau
            let row = document.getElementById('circuitsTable').insertRow(-1);
                row.className = "row";
    
            // Crée des cellules dans la ligne
            let cellule1 = row.insertCell(0);
                cellule1.className = "left-align"
            let cellule2 = row.insertCell(1);
                cellule2.className = "right-column"
    
            // Rempli les cellules
            cellule1.innerHTML = "<p class='bold'>" + circuitName + "</p><p id='description" + place + "'>" + description + "</p>"
            cellule2.innerHTML = speed + " km/h"
        }
    } else {
        for (let i = 0; i <= 2; i++) {
        
            let place = i + 1;
    
            // Crée une ligne dans le tableau
            let row = document.getElementById('circuitsTable').insertRow(-1);
                row.className = "row";
    
            // Crée des cellules dans la ligne
            let cellule1 = row.insertCell(0);
                cellule1.className = "left-align"
            let cellule2 = row.insertCell(1);
                cellule2.className = "right-column"
    
            // Rempli les cellules
            cellule1.innerHTML = "<p class='bold'>Aucune donnée</p><p id='description" + place + "'>--</p>"
            cellule2.innerHTML = "-- km/h"
        }
    }
}

function deleteTop3Circuits() {
    const elements = document.getElementsByClassName('row');
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

let tabProblemes = [];
async function renderProblems() {
    const results = await getResults();
    
    tabProblemes = [];
    for (const result of results) {
        const resultsProblems = result.Results;
        for (const problem of resultsProblems) {
            if(problem.status != "Finished" && !problem.status.includes("Lap")) {
                tabProblemes.push(problem.status)
            }
        }
    }

    let problemes = countOccurrencies(tabProblemes);

    let sortedProblemes = [];
    for (let probleme in problemes) {
        sortedProblemes.push([probleme, problemes[probleme]]);
    }

    sortedProblemes.sort(function(a, b) {
        return b[1] - a[1];
    });

    getProblemRow(sortedProblemes)
}

async function getProblemRow(tabProblemes) {
    for (let i = 0; i <= 2; i++) {
        //console.log(tabProblemes[i]);

        let probleme = tabProblemes[i][0];
        let occurrence = tabProblemes[i][1];

        // Crée une ligne dans le tableau
        let row = document.getElementById('problemsTable').insertRow(-1);
        row.className = "row";

        // Crée des cellules dans la ligne
        let cellule1 = row.insertCell(0);
            cellule1.className = "left-align"
        let cellule2 = row.insertCell(1);
            cellule2.className = "right-column"

        // Rempli les cellules
        cellule1.innerHTML = "<p class='bold'>" + probleme + "</p><p><br></p>"
        cellule2.innerHTML = occurrence
    }
}

function countOccurrencies(arr) {
    return arr.reduce((prev, curr) => (prev[curr] = ++prev[curr] || 1, prev), {})
}

function renderTop3Circuits() {
    renderTop3()
    renderFastestCircuits()
    renderProblems()
}

export { renderTop3Circuits, deleteTop3Circuits }