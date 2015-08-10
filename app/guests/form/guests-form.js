/*jslint browser: true */
/*global define */

define(['knockout', 'i18n', 'app/service/tagsinput', 'app/guests/guests-model', 'app/service/guests'], function (ko, i18n, TagsInput, Guest, GuestsService) {
    'use strict';

    function GuestFormView(params) {
        var self = this,
            rendered = false,
            defaultGuest = (params && params.guest) || new Guest(),

            activate = function () {
                self.guest = ko.observable(defaultGuest);
            };

        self.initTags = function () {
            // ko calls this afterRender method twice, I don't know why
            if (rendered) {
                return;
            }
            var tagsinput = new TagsInput();
            tagsinput
                .setTagLinks(self.guest().tags())
                .onChange(function (event) {
                    GuestsService.changeTag(event.item);
                })
                .onRemove(function (event) {
                    self.guest().tags.remove(event.item);
                    GuestsService.removeTag(event.item);
                })
                .onAdd(function (event) {
                    self.guest().tags.push(event.item);
                    GuestsService.addTag(event.item);
                });

            tagsinput.init('.guests-form[data-id="' + self.getFormId() + '"]');
            rendered = true;
        };

        self.getFormId = function () {
            return self.guest().id();
        };

        self.i18n = i18n;

        activate();
    }

    return {
        viewModel: GuestFormView,
        template: {require: 'text!app/guests/form/guests-form.html'}
    };
});
