/*jslint browser: true */
/*global define */

define(['knockout', 'app/tags/tags-model', 'app/service/tags'], function (ko, Tag, TagsService) {
    'use strict';

    var
        id = 0,
        GuestTag = function (rawData) {
            var self = this,
                data = rawData || {};

            if (!data.id) {
                id += 1;
            }

            self.id = ko.observable(data.id || 'new-guest-tag-' + id);
            self.is_confirmed = ko.observable(data.is_confirmed);

            self.tag = ko.observable(new Tag());
            TagsService.list().done(function (tags) {
                ko.utils.arrayForEach(tags(), function (t) {
                    if (t.id() === data.tag.id) {
                        self.tag(t);
                        return true;
                    }
                });
            });
        };

    return GuestTag;
});
