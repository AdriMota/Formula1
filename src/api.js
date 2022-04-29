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

    const URL_ACCIDENTS = 'http://ergast.com/api/f1/' + year + '/status/' + accident + '/results.json?limit=100'

    const accidentsList = await loadJson(`${URL_ACCIDENTS}`);
    const accidents = accidentsList.MRData.RaceTable.Races;
    
    return accidents;
}

// Retourne une liste de collisions
async function getCollisions() {
    const year = state.yearSelected;
    const collision = state.collision;

    const URL_COLLISIONS = 'http://ergast.com/api/f1/' + year + '/status/' + collision + '/results.json?limit=100'

    const collisionsList = await loadJson(`${URL_COLLISIONS}`);
    const collisions = collisionsList.MRData.RaceTable.Races;
    
    return collisions;
}

export { getCircuits, getAccidents, getCollisions }

/* Promise.all([
    json(URL_TRACKS)
])

    // LOCALISATION DES CIRCUITS
    .then(([tracks]) => {
        const circuits = tracks.MRData.CircuitTable.Circuits;
    })

console.log(circuits); */