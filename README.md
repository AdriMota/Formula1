# Formula1
Projet sur la thématique de la **Formule 1** réalisé pour le cours de visualisation de données.

## Contexte
### Données des courses
Les données utilisées pour ce projet proviennent d'une API ayant des données sur les championnats de Formule 1 dès 1950, date à laquelle les championnats du monde de F1 ont commencé. L'API est mise à disposition sur [Ergast](http://ergast.com/) et est règlementée par des [termes et conditions d'utilisation](http://ergast.com/mrd/terms/).

### Données textuelles
L'API Ergast fait souvent appel à des données Wikipédia. De plus, afin de compléter les données sur les courses précédemment récoltées, l'[API de Wikipédia](https://www.mediawiki.org/wiki/API:Main_page) sera utilisée.

### Tracé du circuit
Ce [github](https://github.com/bacinger/f1-circuits) permet de mettre en place le tracé des circuits. Cependant, il se pourrait que certains ne soient pas disponibles.

### Cartographie
La carte du monde utilisée sera prise du répertoire github [leaflet-providers](https://github.com/leaflet-extras/leaflet-providers). Les maps peuvent être prévisualisées depuis [ici](https://leaflet-extras.github.io/leaflet-providers/preview/). 

## Description
Les données d'Ergast peuvent être récupérées via l'API ou téléchargées dans un fichier au format CSV.

Afin d'avoir des données continuellement à jour, le projet sera réalisé via l'API. Cette dernière retourne des informations soit au format XML, soit JSON. Le deuxième format de réponse sera utilisé pour la réalisation de ce projet. Les données mises à disposition et leurs attributs sont :

| Données sur        | Attributs           |
| ------------- |:-------------:|
| [Saisons](http://ergast.com/mrd/methods/seasons/) | Année, URL |
| [Calendrier des courses](http://ergast.com/mrd/methods/schedule/) | Nom, date, heure, URL |
| [Résultats de la course](http://ergast.com/mrd/methods/results/) | Nombre, grille, position, points, tours, temps, tour le plus rapide, vitesse moyenne |
| [Résultats des qualifications](http://ergast.com/mrd/methods/qualifying/) | Nombre, position, Q1, Q2, Q3 |
| [Résultats des qualifications sprint](http://ergast.com/mrd/methods/sprint/) |  Nombre, grille, position, points, tours, statut, temps, tour le plus rapide |
| [Classements](http://ergast.com/mrd/methods/standings/) | Position, points, victoires |
| [Informations sur le pilote](http://ergast.com/mrd/methods/drivers/) | Numéro, code, prénom, nom, date de naissance, nationalité, URL |
| [Informations sur le constructeur](http://ergast.com/mrd/methods/constructors/) | Nom, nationalité, URL |
| [État en fin de course](http://ergast.com/mrd/methods/status/) | Numéro, état |
| [Temps par tour](http://ergast.com/mrd/methods/laps/) | Durée |
| [Arrêts aux stands](http://ergast.com/mrd/methods/pitstops/) | Arrêts, tour, temps, durée |
| Circuits | Référence du circuit, nom, ville, pays, latitude, longitude, altitude, URL |

Les données récupérées seront de type numérique, de chaîne de caractères ou de type date.

## But
L'objectif principal de ce projet est de découvrir les circuits sur lesquels il y a le plus d'accidents. L'API ne donne pas tous les détails des accidents, ce qui rend difficile de déterminer avec certitude les raisons pour lesquelles ces derniers ont lieu. Des images de la piste et une brève description seront alors affichées pour tenter de mieux comprendre certains accidents.

Le but secondaire est de faire un top 5 des pilotes ayant eu le plus d'accidents par année.

## Références
La [galerie d'applications](http://ergast.com/mrd/gallery/) regroupe des exemples d'applications réalisées à partir de l'API Ergast.
La rubrique [Ergast API Topic](https://github.com/topics/ergast-api) regroupe le code source de différents projets utilisant l'API Ergast.

****

# Prototype 
Le prototype de ce projet est accessible depuis [ce lien Figma](https://www.figma.com/proto/YqYlGlrm3LA8b0xfBKB89D/Formula_1-Wireframe?page-id=0%3A1&node-id=1%3A2&viewport=241%2C48%2C0.57&scaling=contain&starting-point-node-id=1%3A2).
