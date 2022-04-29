import * as d3 from 'd3'
import './css/index.css'
import './js/timeline.js'
import './js/map.js'


// ------------------------------------------------------------------------
// MENU
// ------------------------------------------------------------------------
let menus = document.getElementsByClassName("menu");

// Loop through the menus and add the active class to the current/clicked button
for (let i = 0; i < menus.length; i++) {
    menus[i].addEventListener("click", function () {
        let current = document.getElementsByClassName("menu-active");
        current[0].className = current[0].className.replace(" menu-active", "");
        this.className += " menu-active";
    });
}