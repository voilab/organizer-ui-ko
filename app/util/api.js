/*jslint browser: true */
/*global define, console */

define(['knockout', 'jquery', 'lodash', 'app/config'], function (ko, jquery, lodash, config) {
    'use strict';

    var errorFn = function (response) {
            // try to parse response. If json can't be encoded, yell.
            //console.log('error', response);
        },
        getJQueryAjax = function (method, ajax) {
            ajax.url = config.api + ajax.url;
            return jquery
                .ajax(lodash.assign({
                    dataType: "json",
                    method: method
                }, ajax || {}))
                .fail(errorFn);
        },
        api = {
            // basic
            get: function (url, params) {
                return getJQueryAjax('GET', {
                    url: url,
                    data: params
                });
            },
            post: function (url, params) {
                return getJQueryAjax('POST', {
                    url: url,
                    data: params
                });
            },
            basePut: function (url, params) {
                return getJQueryAjax('PUT', {
                    url: url,
                    data: params
                });
            },
            baseDel: function (url, params) {
                return getJQueryAjax('DELETE', {
                    url: url,
                    data: params
                });
            },
            // ko
            save: function (url, data, json) {
                var id = typeof data.id === 'function' ? data.id() : data.id,
                    method = id ? 'PUT' : 'POST',
                    baseUrl = id ? url + '/' + id : url,
                    params = ko[json ? 'toJSON' : 'toJS'](data);

                return getJQueryAjax(method, {
                    url: baseUrl,
                    data: params
                });
            },
            put: function (url, data, json) {
                var id = typeof data.id === 'function' ? data.id() : data.id,
                    params = ko[json ? 'toJSON' : 'toJS'](data);

                return api.basePut(url + '/' + id, params);
            },
            del: function (url, data, json) {
                var id = typeof data.id === 'function' ? data.id() : data.id,
                    params = ko[json ? 'toJSON' : 'toJS'](data);

                return api.baseDel(url + '/' + id, params);
            }
        };

    return api;
});
