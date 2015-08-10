/*jslint browser: true */
/*global define, console */

define('i18n', ['app/service/i18n'], function (i18n) {
    'use strict';

    return i18n.addTerms('fr', {
        // Common
        "Tags": "Tags",
        "Add notes": "Ajouter une note...",
        "Empty search": "Vider la recherche",

        // Guests list
        "Search general": "Recherche générale...",
        "Search tags": "Recherche par tags...",

        // Guests form
        "Firstname": "Prénom",
        "Name": "Nom",
        "Email": "Email",
        "Address": "Adresse complète + retours de ligne...",

        // Tags list
        "Tag": "Tag",
        "Tag name": "Nom du tag",
        "Confirmable": "Confirmable",
        "Max": "Max",
        "Notes": "Notes",

        // Tags filters
        "Search by tag": "Recherche par tags",
        "Choose an existing filter": "Choisir un filtre existant",
        "Go": "Go!",
        "Add, duplicate": "Ajouter, dupliquer",
        "Rename filter": "Renommer le filtre",
        "Remove filter": "Supprimer le filtre",
        "Set filter title": "Changer le nom du filtre"
    });
});