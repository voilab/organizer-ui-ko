/*jslint browser: true, unparam: true */
/*global define, console */

define(['knockout', 'lodash', 'app/util/api', 'app/tags/tags-filters-model'], function (ko, lodash, api, TagsFilter) {
    'use strict';

    return {

        list: function () {
            return api.get('/tags-filters.json').then(function (data) {
                return lodash.map(data, function (p) {
                    return new TagsFilter(p);
                });
            });
        },

        save: function (filter) {
            return api.save('/tags/filters', filter);
        },

        remove: function (filter) {
            return api.del('/tags/filters', filter);
        },

        changeTag: function (link) {
            return api.put('/filters/tags', link);
        },

        addTag: function (link) {
            return api.post('/filters/tags', link);
        },

        removeTag: function (link) {
            return api.del('/filters/tags', link);
        },

        filter: function (guest, filterStr) {
            var text = '';
            // make one string with all fields in which the
            // search should occur
            text = (guest.firstname() || '').toLowerCase()
                + (guest.name() || '').toLowerCase()
                + (guest.email() || '').toLowerCase()
                + (guest.address() || '').toLowerCase()
                + (guest.notes() || '').toLowerCase();

            // test indexOf on this one string
            return text.indexOf(filterStr) !== -1;
        }
    };

});