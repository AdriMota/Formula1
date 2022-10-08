import { state } from './js/state.js';

// Fonction loadJson utilisée à l'interne. Elle s'occupe de charger l'url passée en paramètre et convertir
// son résultat en json
async function loadJson(url) {
    const response = await fetch(url)
    const parsedJson = await response.json()
    return parsedJson
}

// Retourne une liste de circuits
async function getCircuits() {
    const year = state.yearSelected;

    const URL_TRACKS = 'https://ergast.com/api/f1/' + year + '/circuits.json?limit=100';

    const circuitsList = await loadJson(`${URL_TRACKS}`);
    const circuits = circuitsList.MRData.CircuitTable.Circuits;    
    
    return circuits;
}

// Retourne une liste d'accidents
async function getAccidents() {
    const year = state.yearSelected;
    const accident = state.accident;

    const URL_ACCIDENTS = 'https://ergast.com/api/f1/' + year + '/status/' + accident + '/results.json?limit=100'

    const accidentsList = await loadJson(`${URL_ACCIDENTS}`);
    const accidents = accidentsList.MRData.RaceTable.Races;
    
    return accidents;
}

// Retourne une liste de collisions
async function getCollisions() {
    const year = state.yearSelected;
    const collision = state.collision;

    const URL_COLLISIONS = 'https://ergast.com/api/f1/' + year + '/status/' + collision + '/results.json?limit=100'

    const collisionsList = await loadJson(`${URL_COLLISIONS}`);
    const collisions = collisionsList.MRData.RaceTable.Races;
    
    return collisions;
}

// Retourne la vitesse
async function getResults() {
    const year = state.yearSelected;

    const URL_RESULT = 'https://ergast.com/api/f1/' + year + '/results.json?limit=1000'

    const resultList = await loadJson(`${URL_RESULT}`);
    const results = resultList.MRData.RaceTable.Races;

    return results;
}

// Retourne une description
async function getDescription(url, place) {
    let replaceURL = url.replace("http:\/\/en.wikipedia.org\/wiki\/", "");
    let description = [];

    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=query&format=json&prop=extracts&titles=" + replaceURL + "&exsentences=1&exintro=1&explaintext=1&exsectionformat=plain&origin=*&redirects",
        dataType: "json",
        success: function (data) {

            let pageid = [];
            for (let id in data.query.pages) {
                pageid.push(id);
            }
            
            document.getElementById("description" + place).textContent = data.query.pages[pageid[0]].extract;

        },
        error: function (xhr) {
            alert(xhr.statusText)
        }
    })
    
    return description;
}

export { getCircuits, getAccidents, getCollisions, getDescription, getResults }