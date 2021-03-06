/*jslint browser: true */
/*global define */

define(['knockout', 'lodash', 'app/tags/tags-model', 'app/service/tags'], function (ko, lodash, Tag, TagsService) {
    'use strict';

    var
        id = 0,
        TagsFilterLink = function (rawData) {
            var self = this,
                data = rawData || {};

            if (!data.id) {
                id += 1;
            }

            self.id = ko.observable(data.id || 'new-filter-tag-' + id);
            self.is_confirmed = ko.observable(data.is_confirmed);

            self.tag = ko.observable(new Tag());
            TagsService.list().done(function (tags) {
                lodash.forEach(tags(), function (t) {
                    if (t.id() === data.tag.id) {
                        self.tag(t);
                        return true;
                    }
                });
            });
        };

    return TagsFilterLink;
});
