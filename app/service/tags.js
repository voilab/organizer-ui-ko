/*jslint browser: true */
/*global define, console */

define(['knockout', 'lodash', 'app/util/api', 'app/tags/tags-model'], function (ko, lodash, api, Tag) {
    'use strict';

    // load list only once
    var tags_list = api.get('/tags.json').then(function (data) {
        return ko.observableArray(lodash.map(data, function (p) {
            return new Tag(p);
        }));
    });

    return {

        list: function () {
            return tags_list;
        },

        remove: function (tag) {
            return api.del('/tags', tag);
        },

        filterText: function (tag, filterStr) {
            var text = '';
            // make one string with all fields in which the
            // search should occur
            text = (tag.name() || '').toLowerCase()
                + (tag.notes() || '').toLowerCase();

            // test indexOf on this one string
            return text.indexOf(filterStr) !== -1;
        },

        filter: function (links, filterStr) {
            var oktags = 0,
                nbtags = (filterStr.match(/\|\|/g) || []).length + 1;

            // loop on all tag links
            lodash.forEach(links, function (link) {
                var parts = ['|', link.tag().id()],
                    // parts2 is used to check on confirmable
                    // tags, without looking at the status
                    parts2 = [].concat(parts),
                    found = false;

                if (link.tag().is_confirmable()) {
                    parts.push('-', link.is_confirmed());
                }
                parts.push('|');
                parts2.push('|');
                found = filterStr.indexOf(parts.join('')) !== -1 || filterStr.indexOf(parts2.join('')) !== -1;
                if (found) {
                    oktags += 1;
                }
            });
            // adapt here to manage OR/AND logic in search
            return oktags === nbtags;
        }
    };

});