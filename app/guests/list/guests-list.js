/*jslint browser: true */
/*global define */

define(['knockout', 'lodash', 'i18n', 'app/guests/guests-model', 'app/service/tagsinput', 'app/service/tags', 'app/service/guests'], function (ko, lodash, i18n, Guest, TagsInput, TagsService, GuestsService) {
    'use strict';

    function GuestListView() {
        var self = this,
            rendered = false,
            tagsinput = null,
            filterGuests = function () {
                var f = self.currentFilter();
                if (f && (f.name || f.tags)) {
                    return lodash.filter(self.guests(), function (guest) {
                        var by_name = null,
                            by_tag = null;

                        if (f.name) {
                            by_name = GuestsService.filter(guest, f.name);
                        }
                        if (f.tags) {
                            by_tag = TagsService.filter(guest.tags(), f.tags);
                        }
                        return by_name !== false && by_tag !== false;
                    });
                }
                return self.guests();
            },
            filterTags = function () {
                self.currentFilter(lodash.assign(self.currentFilter(), {
                    tags: tagsinput.getFilter()
                }));
            },
            initFilters = function () {
                self.searchByName = ko.observable('').extend({
                    rateLimit: {
                        method: 'notifyWhenChangesStop',
                        timeout: 500
                    }
                });
                self.searchByName.subscribe(function (value) {
                    self.currentFilter(lodash.assign(self.currentFilter(), {
                        name: value.toLowerCase()
                    }));
                });

                self.currentFilter = ko.observable({});
                self.guestsFilter = ko.computed(filterGuests);
            },
            activate = function () {
                initFilters();
                GuestsService.list().done(function (data) {
                    self.guests(data());
                });
            };

        self.initTags = function () {
            // ko calls this afterRender method twice, I don't know why
            if (rendered) {
                return;
            }
            tagsinput = new TagsInput();
            tagsinput
                .setFourStates(true)
                .onChange(filterTags)
                .onRemove(filterTags)
                .onAdd(filterTags);

            tagsinput.init('.searchByTags');
            rendered = true;
        };

        self.undoSearch = function () {
            self.searchByName('');
            tagsinput.input.tagsinput('removeAll');
        };

        self.addGuest = function () {
            self.guests.unshift(new Guest());
        };

        self.removeGuest = function (guest) {
            GuestsService.remove(guest).done(function () {
                self.guests.remove(guest);
            });
        };

        self.guests = ko.observableArray();
        self.i18n = i18n;

        activate();
    }

    return {
        viewModel: GuestListView,
        template: {require: 'text!app/guests/list/guests-list.html'}
    };
});
