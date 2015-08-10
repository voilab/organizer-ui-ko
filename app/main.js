/*jslint browser: true */
/*global define */

define(['knockout', 'app/util/knockout-extension', 'twitterBootstrap', 'bootstrapTags', 'typeahead'], function (ko) {
    'use strict';

    ko.components.register('guests-list', {require: 'app/guests/list/guests-list'});
    ko.components.register('guests-form', {require: 'app/guests/form/guests-form'});
    ko.components.register('tags-list', {require: 'app/tags/list/tags-list'});
    ko.components.register('tags-filters', {require: 'app/tags/filters/tags-filters'});

    ko.applyBindings();
});
