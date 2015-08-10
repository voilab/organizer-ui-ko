/*jslint browser: true */
/*global define */

define(['require', 'knockout'], function (require, ko) {
    'use strict';

    var
        id = 0,
        Tag = function (rawData) {
            var self = this,
                data = rawData || {},
                // avoid circular require
                tagsinput = require('app/service/tagsinput');

            if (!data.id) {
                id += 1;
            }

            self.id = ko.observable(data.id || 'new-tag-' + id);
            self.name = ko.observable(data.name);
            self.is_confirmable = ko.observable(data.is_confirmable);
            self.max_guests = ko.observable(data.max_guests);
            self.notes = ko.observable(data.notes);

            self.name.subscribe(function () {
                tagsinput.refresh();
            });

            self.is_confirmable.subscribe(function () {
                tagsinput.refresh();
            });
        };

    return Tag;
});
