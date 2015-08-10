/*jslint browser: true */
/*global define */

define(['knockout', 'lodash', 'app/guests/guests-tags-model'], function (ko, lodash, GuestTag) {
    'use strict';

    var
        id = 0,
        Guest = function (rawData) {
            var self = this,
                data = rawData || {};

            if (!data.id) {
                id += 1;
            }

            self.id = ko.observable(data.id || 'new-guest-' + id);
            self.firstname = ko.observable(data.firstname);
            self.name = ko.observable(data.name);
            self.email = ko.observable(data.email);
            self.address = ko.observable(data.address);
            self.notes = ko.observable(data.notes);
            self.tags = ko.observableArray(lodash.map(data.tags || [], function (d) {
                return new GuestTag(d);
            }));
        };

    return Guest;
});
