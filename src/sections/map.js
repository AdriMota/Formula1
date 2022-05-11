import * as d3 from 'd3'
import circuitsLayout from '../lib/circuitsLayout.json';
import { getCircuits, getAccidents, getCollisions } from '../api.js';
import L, { latLng } from 'leaflet';


//const URL_TRACKS = 'https://ergast.com/api/f1/2021/circuits.json?limit=100';

/* ----------------------------------------------------------------------------------
    MAP
-----------------------------------------------------------------------------------*/
const map = L.map('map').setView([15, 0], 3) //15, 0, 3

L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    minZoom: 3,
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
        const name = circuit.circuitName;        

        // Dessiner un cercle par location du circuit
        drawCircle(lat, long, 1, name);
    }    

    // Dessiner les cercles d'une couleur différente pour les circuits ayant eu des accidents
    renderAccidents()
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

        if (mapAccidents.has(accident.Circuit.circuitId)) {
            const res = mapAccidents.get(accident.Circuit.circuitId);
            res.count += accident.Results.length;
        } else {
            mapAccidents.set(accident.Circuit.circuitId, {
                id: accident.Circuit.circuitId,
                lat: accident.Circuit.Location.lat,
                long: accident.Circuit.Location.long,
                count: accident.Results.length,
                name: accident.Circuit.circuitName
            });
        }

        if (accident.Results.length > 0) cmptAccidents += accident.Results.length;
    }

    //console.log(mapAccidents);

    // Détermine le plus grand nombre d'accidents parmis tous les circuits de l'année
    let nbAccidents = 0;
    
    for (const [key, value] of mapAccidents.entries()) {
        if (value.count > nbAccidents) nbAccidents = value.count;
    }

    for (const [key, value] of mapAccidents.entries()) {
        const accidents = 1 - (value.count / nbAccidents);
        
        // L'objectif est de dessiner des cerles allant de rouge à vert 
        // en fonction du nombre d'accidents sur la piste pour l'année en question.
        drawCircle(value.lat, value.long, accidents, value.name);
    }

}

export { renderCircuits, deleteCircuits }

/* ----------------------------------------------------------------------------------
    CERCLES
-----------------------------------------------------------------------------------*/
let circles = [];
let layerCircles = L.layerGroup().addTo(map);

// Dessiner un cercle
function drawCircle(lat, long, accidents, name) {
        
    let circle = L.circleMarker([lat, long], {
        color: d3.interpolateRdYlGn(accidents),
        fillColor: d3.interpolateRdYlGn(accidents),
        radius: 6
    }).addTo(map);

    layerCircles.addLayer(circle);
    circle.bindPopup(L.popup().setContent(name))
        .on('mouseover', function() { this.openPopup() })
        .on('mouseout', function() { this.closePopup() })
        .on('click', function(event) { showPopup(event) })

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

        // Cacher la popup
        document.getElementById("popup").style.visibility = "hidden";

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
function showPopup(event) {

    document.getElementById("popup").style.visibility = "visible";
    document.getElementById("informations").style.visibility = "hidden";

    // Récupérer les limites du circuit
    for (const circuit of circuits) {
        //console.log(circuit);        
        if(event.latlng.lng == circuit.Location.long) {
            const name = circuit.circuitName;
            document.getElementById('circuitName').textContent = circuit.circuitName + ", " + circuit.Location.country;
            document.getElementById("more").setAttribute('href', circuit.url)
            
            let replaceURL = circuit.url.replace("http:\/\/en.wikipedia.org\/wiki\/", "");
            
            $.ajax({
                url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=" + replaceURL + "&exsentences=7&exintro=1&explaintext=1&exsectionformat=plain&origin=*&redirects",
                dataType: "json",
                success: function (data) {
        
                let pageid = [];
                for (let id in data.query.pages) {
                    pageid.push(id);
                }
        
                document.getElementById("circuitDescription").textContent = data.query.pages[pageid[0]].extract;
        
                },
                error: function (xhr) {
                  alert(xhr.statusText)
                }
            })

            // Trouver le centre du tracé
            getTrackLimits(name, circuit.Location.locality)

            // Indiquer combien d'accidents il y a eu
            /* for (const [key, value] of mapAccidents.entries()) {
                if (value.id == circuit.circuitId) {
                    document.getElementById('accidents').textContent = "Il y a eu " + value.count + " accidents sur ce circuit."
                } else {
                    //document.getElementById('accidents').textContent = "Il y a eu 0 accidents sur ce circuit."
                }
            } */
        }        
    }
    
    const lat = event.latlng.lat;
    const long = event.latlng.lng + 0.015;

    if(centerTrack === null || centerTrack === undefined) {
        // S'il n'y a pas de tracé, zoom sur le centre du cercle (markeur)
        map.flyTo(latLng(lat, long), 15, { 'duration' : 1.2 })
    } else {
        // S'il y a un tracé, zoom sur le centre du tracé
        map.flyToBounds(centerTrack, { 'duration' : 1.2, 'maxZoom': 15.8, 'paddingBottomRight': [750, 0] })
        centerTrack = null;
    }
}

// Cacher la popup
const closer = document.getElementById('close');

closer.addEventListener('click', function() {
    document.getElementById("popup").style.visibility = "hidden";
    document.getElementById("informations").style.visibility = "visible";
    map.flyTo([15, 0], 3, { 'duration': 1.2 })
})


// Trouve les limites du circuit afin de pouvoir zoomé au centre de celui-ci
let centerTrack = null;
function getTrackLimits(nameCircuit, localityCircuit) {
    for (const track of circuitsLayout.features) {
        if(track.properties.Name.includes(nameCircuit)) {
            let bound1 = [track.bbox[3], track.bbox[0] ];
            let bound2 = [track.bbox[1], track.bbox[2]];
            centerTrack = L.latLngBounds(bound2,bound1);
        } else if(track.properties.Location.includes(localityCircuit)) {
            let bound1 = [track.bbox[3], track.bbox[0] ];
            let bound2 = [track.bbox[1], track.bbox[2]];
            centerTrack = L.latLngBounds(bound2,bound1);            
        }        
    }        
}

// Charger les images
async function renderImages() {
    images = await getImages()
    //console.log(circuits);
}