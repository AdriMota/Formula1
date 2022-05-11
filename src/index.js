import './css/index.css'
import './js/timeline.js'
import './sections/map.js'
import { renderTop3Circuits, deleteTop3Circuits } from './sections/circuits.js';
import './sections/circuits.js'

/* ----------------------------------------------------------------------------------
    TOGGLES
-----------------------------------------------------------------------------------*/
function toggleSection(section) {
    // Supprime/Ajoute la classe active sur la section
    document.querySelector('section.active')?.classList.remove('active')
    document.querySelector(`${section}`)?.classList.add('active')
}
  
function toggleNav(section) {
    // Supprime/Ajoute la classe active sur le lien
    document.querySelector('.menu-active')?.classList.remove('menu-active')
    document.querySelector(`a[href="${section}"]`)?.classList.add('menu-active')
}
  
// Affichage d'une section
function displaySection() {
    // S'il n'y a pas de hash (par ex, on est sur "localhost:8080/"), le défaut devient '#home'
    const section = window.location.hash || '#home'
    const sectionSplit = section.split('-')
    document.getElementById('titlePage').textContent = "Accidents en Formule 1"
  
    // Toggle par défaut des sections et de la navigation
    toggleSection(sectionSplit[0])
    toggleNav(sectionSplit[0])
  
    // Chargement des éléments custom par section
    switch(sectionSplit[0]) {  
        case '#circuits':
            // Change le titre de la page
            document.getElementById('titlePage').textContent = "Circuits avec le plus d'accidents"

            deleteTop3Circuits()
            renderTop3Circuits()

            // Utilise la section 'circuits'
            toggleSection('#circuits')
        break;
    }
  }
  
  // Être averti d'un changement de hash dans l'url
  window.addEventListener('hashchange', displaySection)
  
  // Affichage au chargement pour traiter l'url en cours
  displaySection()