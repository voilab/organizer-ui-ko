/*jslint browser: true */
/*global define */

define(['knockout', 'lodash', 'app/tags/tags-filters-link-model'], function (ko, lodash, TagsFilterLink) {
    'use strict';

    var
        id = 0,
        TagsFilter = function (rawData) {
            var self = this,
                data = rawData || {};

            if (!data.id) {
                id += 1;
            }

            self.id = ko.observable(data.id || 'new-filter-' + id);
            self.name = ko.observable(data.name);
            self.tags = ko.observableArray(lodash.map(data.tags || [], function (d) {
                return new TagsFilterLink(d);
            }));
        };

    return TagsFilter;
});
