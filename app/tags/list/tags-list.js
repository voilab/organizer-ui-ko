/*jslint browser: true */
/*global define */

define(['knockout', 'i18n', 'app/service/tags', 'app/tags/tags-model'], function (ko, i18n, TagsService, Tag) {
    'use strict';

    function TagListView() {
        var self = this,
            rateLimit = {
                method: 'notifyWhenChangesStop',
                timeout: 500
            },
            filterTags = function () {
                var f = self.currentFilter();
                if (f) {
                    return ko.utils.arrayFilter(self.tags(), function (tag) {
                        return TagsService.filterText(tag, f);
                    });
                }
                return self.tags();
            },
            activate = function () {
                TagsService.list().done(function (data) {
                    self.tags(data());
                });
            };

        self.addTag = function () {
            self.tags.unshift(new Tag());
        };

        self.removeTag = function (tag) {
            TagsService.remove(tag).done(function () {
                self.tags.remove(tag);
            });
        };

        self.undoSearch = function () {
            self.searchByTag('');
        };

        self.i18n = i18n;
        self.tags = ko.observableArray();

        self.currentFilter = ko.observable();
        self.tagsFilter = ko.computed(filterTags);
        self.searchByTag = ko.observable().extend({rateLimit: rateLimit});
        self.searchByTag.subscribe(function (value) {
            self.currentFilter(value.toLowerCase());
        });

        activate();
    }

    return {
        viewModel: TagListView,
        template: {require: 'text!app/tags/list/tags-list.html'}
    };
});
