/*jslint browser: true */
/*global define */

define(['knockout', 'lodash', 'i18n', 'app/service/filters', 'app/service/tagsinput', 'app/tags/tags-filters-model', 'app/service/guests', 'app/service/tags'], function (ko, lodash, i18n, FiltersService, TagsInput, TagsFilter, GuestsService, TagsService) {
    'use strict';

    function TagGroupView() {
        var self = this,
            rendered = false,
            tagsInput = new TagsInput(),

            filterChange = function (filter) {
                if (!filter) {
                    return;
                }
                tagsInput
                    .setTagLinks(filter.tags())
                    .reload();
            },

            activate = function () {
                FiltersService.list().done(function (data) {
                    self.filters.pushAll(data);
                });
            };

        self.initTags = function () {
            // ko calls this afterRender method twice, I don't know why
            if (rendered) {
                return;
            }
            tagsInput
                .setFourStates(true)
                .onChange(function (event) {
                    FiltersService.changeTag(event.item);
                })
                .onRemove(function (event) {
                    self.selectedFilter().tags.remove(event.item);
                    FiltersService.removeTag(event.item);
                })
                .onAdd(function (event) {
                    self.selectedFilter().tags.push(event.item);
                    FiltersService.addTag(event.item);
                });

            tagsInput.init('#tags-group-list');
            rendered = true;
        };

        self.addFilter = function () {
            var filter = self.selectedFilter() || new TagsFilter();
            self.filters.push(filter);
            FiltersService.save(filter).done();
        };

        self.editFilter = function () {
            var filter = self.selectedFilter() || new TagsFilter(),
                name = window.prompt(i18n.get("Set filter title"), filter.name());

            if (name) {
                filter.name(name);
                FiltersService.save(filter);
            }
        };

        self.removeFilter = function () {
            var filter = self.selectedFilter();
            FiltersService.remove(filter).done(function () {
                self.filters.remove(filter);
            });
        };

        self.resultTagClass = function (group) {
            var cls = 'badge badge-',
                suffix = 'default';

            if (group.is_confirmable) {
                if (group.is_confirmed > 0) {
                    suffix = 'success';
                } else if (group.is_confirmed < 0) {
                    suffix = 'danger';
                } else {
                    suffix = 'warning';
                }
            }
            return cls + suffix;
        };

        self.doFilter = function () {
            GuestsService.list().done(function (data) {
                self.results(GuestsService.countByTags(data(), tagsInput.getFilter()));
            });
        };

        self.i18n = i18n;
        self.filters = ko.observableArray();
        self.selectedFilter = ko.observable();
        self.selectedFilter.subscribe(filterChange);
        self.results = ko.observable({});

        activate();
    }

    return {
        viewModel: TagGroupView,
        template: {require: 'text!app/tags/filters/tags-filters.html'}
    };
});
