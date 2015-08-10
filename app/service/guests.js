/*jslint browser: true, unparam: true */
/*global define, console */

define(['require', 'knockout', 'app/util/api', 'app/guests/guests-model'], function (require, ko, api, Guest) {
    'use strict';

    // load list only once
    var guests_list = api.get('/guests.json').then(function (data) {
        return ko.observableArray(ko.utils.arrayMap(data, function (p) {
            return new Guest(p);
        }));
    });

    return {

        list: function () {
            return guests_list;
        },

        remove: function (guest) {
            return api.del('/guest', guest);
        },

        changeTag: function (link) {
            return api.put('/guests/tags', link);
        },

        addTag: function (link) {
            return api.post('/guests/tags', link);
        },

        removeTag: function (link) {
            return api.del('/guests/tags', link);
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
        },

        countByTags: function (guests, tags) {
            var TagsService = require('app/service/tags'),
                sums = {
                    total: 0,
                    tags: []
                },
                ids = {},
                // js foreach is ok on array but not on object. This method
                // convert a unique id into the corresponding array index
                mapId = function (arr, type, id) {
                    if (ids[type] === undefined) {
                        ids[type] = {};
                    }
                    if (ids[type][id] === undefined) {
                        ids[type][id] = arr.length;
                    }
                    return ids[type][id];
                },
                // then filter guests to match tags
                guestsFilter =  ko.utils.arrayFilter(guests, function (guest) {
                    return TagsService.filter(guest.tags(), tags);
                });

            // finally, calculate sums for each tags
            ko.utils.arrayForEach(guestsFilter, function (guest) {
                sums.total += 1;
                ko.utils.arrayForEach(guest.tags(), function (link) {
                    var tag = link.tag(),
                        id = mapId(sums.tags, 'tags', tag.id()),
                        group = '';

                    if (sums.tags[id] === undefined) {
                        sums.tags[id] = {
                            link: link,
                            groups: []
                        };
                    }
                    group = mapId(sums.tags[id].groups, 'groups-' + id, tag.is_confirmable() ? link.is_confirmed() : '');
                    if (sums.tags[id].groups[group] === undefined) {
                        sums.tags[id].groups[group] = {
                            is_confirmable: tag.is_confirmable(),
                            is_confirmed: link.is_confirmed(),
                            total: 0
                        };
                    }
                    sums.tags[id].groups[group].total += 1;
                });
            });
            return sums;
        }
    };

});