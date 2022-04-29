import { domOn } from '../lib/dom.js';
import { state } from './state.js';
import { renderCircuits, deleteCircuits, renderAccidents } from './map.js';

/* ----------------------------------------------------------------------------------
    Déterminer l'année max de la timeline
-----------------------------------------------------------------------------------*/
let timeline = document.getElementById("timeline");
let year = new Date().getFullYear();  // returns the current year;

timeline.setAttribute('max', year);
timeline.setAttribute('value', year);


/* ----------------------------------------------------------------------------------
    Afficher l'année sous la timeline
-----------------------------------------------------------------------------------*/
let input = document.querySelector('input'),
    output = document.querySelector('output');

output.innerHTML = input.value;


/* ----------------------------------------------------------------------------------
    Changer la valeur lors du slide de la timeline
-----------------------------------------------------------------------------------*/
timeline.onchange = function () {
    year = this.value
    output.innerHTML = input.value
    timeline.setAttribute('value', output.innerHTML)
}

timeline.oninput = function () {
    year = this.value
    output.innerHTML = input.value
    timeline.setAttribute('value', output.innerHTML)
}


/* ----------------------------------------------------------------------------------
    Écoute les changements d'année et retourne l'année choisie
-----------------------------------------------------------------------------------*/
domOn('input', 'change', event => {
    state.yearSelected = timeline.getAttribute('value');
    deleteCircuits();
    renderAccidents();
    renderCircuits();
})

//export { yearSelected };