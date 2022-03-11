# Formula1
Projet sur la thématique de la **Formule 1** réalisé pour le cours de visualisation de données.

## Contexte
Les données utilisées pour ce projet proviennent d'une API ayant des données sur les championnats de Formule 1 dès 1950, date à laquelle les championnats du monde de F1 ont commencé. L'API est mise à disposition sur [Ergast](http://ergast.com/) et est règlementée par des [termes et conditions d'utilisation](http://ergast.com/mrd/terms/).

## Description
Les données d'Ergast peuvent être récupérées via l'API ou téléchargées dans un fichier au format CSV.

Afin d'avoir des données continuellement à jour, le projet sera réalisé via l'API. Cette dernière retourne des informations soit au format XML, soit JSON. Le deuxième format de réponse sera utilisé pour la réalisation de ce projet. Les données mises à disposition et leurs attributs sont :
* Circuits :
  * Référence du circuit
  * Nom
  * Ville
  * Pays
  * Latitude
  * Longitude
  * Altitude
  * URL
* Constructeurs :
  * Nom
  * Nationalité
  * URL
* Résultats des constructeurs :
  * Points
* Classement des constructeurs :
  * Points
  * Position
  * Victoires
* Pilotes :
  * Numéro
  * Code
  * Prénom
  * Nom
  * Date de naissance
  * Nationalité
  * URL
* Classement des pilotes :
  * Points
  * Position
  * Victoires
* Temps au tour :
  * Tour
  * Position
  * Temps
  * Millisecondes
* Arrêts aux stands :
  * Arrêts
  * Tour
  * Temps
  * Durée
  * Millisecondes
* Qualifications :
  * Nombre
  * Position
  * Q1
  * Q2
  * Q3
* Courses :
  * Nom
  * Date
  * Heure
  * URL
* Résultats :
  * Nombre
  * Grille
  * Position
  * Points
  * Tours
  * Temps
  * Millisecondes
  * Tour le plus rapide
  * Classement
  * Durée du tour le plus rapide
  * Vitesse du tour le plus rapide
* Saisons :
  * Année
  * URL
* Résultats des sprints :
  * Nombre
  * Grille
  * Position
  * Points
  * Tours
  * Temps
  * Millisecondes
  * Tour le plus rapide
  * Durée du tour le plus rapide
* Statut :
  * Statut

Les données récupérées seront de type numérique, de chaîne de caractères ou de type date.

## But
L'objectif principal de ce projet est de découvrir les circuits sur lesquels il y a le plus d'accidents. L'API ne donne pas tous les détails des accidents, ce qui rend difficile de déterminer les raisons pour lesquelles ces derniers ont lieu.

Le but secondaire est de faire un top 3 des pilotes ayant eu le plus d'accidents par année.

## Références
La [galerie d'applications](http://ergast.com/mrd/gallery/) regroupe des exemples d'applications réalisées à partir de l'API Ergast.
La rubrique [Ergast API Topic](https://github.com/topics/ergast-api) regroupe le code source de différents projets utilisant l'API Ergast.
