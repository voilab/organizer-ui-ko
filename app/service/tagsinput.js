/*jslint browser: true */
/*global define, Bloodhound */

define(['knockout', 'jquery', 'lodash', 'app/service/tags'], function (ko, jquery, lodash, TagsService) {
    'use strict';

    var silent = false,
        id = 0,
        getSource = function (query, process) {
            return TagsService.list().then(function (data) {
                var
                    items = lodash.map(data(), function (tag) {
                        return {
                            id: ko.observable(),
                            is_confirmed: ko.observable(0),
                            tag: ko.observable(tag)
                        };
                    }),
                    tagsFilter = !query ? items : lodash.filter(items, function (item) {
                        return (item.tag().name() || '').toLowerCase().indexOf(query.trim().toLowerCase()) !== -1;
                    });

                process(tagsFilter);
            });
        },

        itemAdded = function (obj, el, event) {
            var boot = jquery(el).prev(),
                tag_el = boot.find('span[class~="tag"]').last(),
                tag = event.item.tag();

            tag_el.on('click', function (e) {
                if (!tag.is_confirmable() || e.target.outerHTML.indexOf('<span data-role') === 0) {
                    return;
                }
                var is_confirmed = event.item.is_confirmed(),
                    cls = 'success',
                    val = 1;
                if (obj.fourStates) {
                    if (is_confirmed > 0) {
                        cls = 'info';
                        val = null;
                    } else if (is_confirmed === null) {
                        cls = 'danger';
                        val = -1;
                    } else if (is_confirmed < 0) {
                        cls = 'warning';
                        val = 0;
                    }
                } else {
                    if (is_confirmed > 0) {
                        cls = 'danger';
                        val = -1;
                    } else if (is_confirmed < 0) {
                        cls = 'warning';
                        val = 0;
                    }
                }
                tag_el
                    .removeClass('label-success label-warning label-danger label-info')
                    .addClass('label-' + cls);

                event.item.is_confirmed(val);
                if (!silent) {
                    obj.onChangeFn(event, tag_el);
                }

                e.preventDefault();
                e.stopPropagation();
                event.preventDefault();
                event.stopPropagation();
            });

            if (!silent) {
                obj.onAddFn(event, tag_el);
            }
        },

        itemRemoved = function (obj, el, event) {
            if (!silent && event.item) {
                obj.onRemoveFn(event, el);
            }
        },

        getTagClass = function (item) {
            var t = 'tag-confirmable label label-',
                is_confirmed = item.is_confirmed();

            if (item.tag().is_confirmable()) {
                if (is_confirmed > 0) {
                    return t + 'success';
                }
                if (is_confirmed < 0) {
                    return t + 'danger';
                }
                if (is_confirmed === null) {
                    return t + 'info';
                }
                return t + 'warning';
            }
            return 'label label-default';
        },

        TagsInput = function () {
            var self = this;
            self.input = null;
            self.fourStates = false;
            self.tagLinks = [];
            self.selector = '';
            self.onAddFn = function () {};
            self.onRemoveFn = function () {};
            self.onChangeFn = function () {};
        };

    lodash.assign(TagsInput.prototype, {
        onAdd: function (fn) {
            this.onAddFn = fn;
            return this;
        },

        onRemove: function (fn) {
            this.onRemoveFn = fn;
            return this;
        },

        onChange: function (fn) {
            this.onChangeFn = fn;
            return this;
        },

        setTagLinks: function (tagLinks) {
            this.tagLinks = tagLinks;
            return this;
        },

        setFourStates: function (states) {
            this.fourStates = states;
            return this;
        },

        reload: function () {
            var self = this;

            silent = true;
            self.input.tagsinput('removeAll');
            silent = false;

            lodash.forEach(self.tagLinks, function (link) {
                silent = true;
                self.input.tagsinput('add', link);
                silent = false;
            });
        },

        getFilter: function () {
            var self = this,
                items = self.input.tagsinput('items') || [],
                tags = '';

            lodash.forEach(items || [], function (item) {
                var tag = typeof item.tag === 'function' ? item.tag() : item.tag,
                    confirm = item.is_confirmed() === null ? '*' : item.is_confirmed(),
                    parts = ['|', tag.id()];

                if (tag.is_confirmable() && confirm !== '*') {
                    parts.push('-', confirm);
                }
                parts.push('|');
                tags += parts.join('');
            });
            return tags;
        },

        init: function (selector) {
            var self = this,
                input = jquery(selector + ' input[data-role="tagsinput"]');

            input
                .on('itemAdded', function (event) {
                    itemAdded(self, this, event);
                })
                .on('itemRemoved', function (event) {
                    itemRemoved(self, this, event);
                })
                .tagsinput({
                    tagClass: getTagClass,
                    itemValue: function (item) {
                        var tag = item.tag();
                        if (!tag.id()) {
                            id += 1;
                        }
                        return tag.id() || 'new-' + id;
                    },
                    itemText: function (item) {
                        var tag = item.tag();
                        return tag.name() || '';
                    },
                    typeaheadjs: {
                        source: getSource,
                        display: function (item) {
                            return item.tag().name() || '';
                        }
                    }
                });

            self.input = input;
            // add tags for this entity
            self.reload();
        }
    });

    TagsInput.refresh = function () {
        var inputs = jquery('input[data-role="tagsinput"]');
        inputs.tagsinput('refresh');
    };

    return TagsInput;
});
