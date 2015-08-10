/*jslint browser: true */
/*global define, console */

define(['lodash', 'app/config'], function (lodash, config) {
    'use strict';

    var terms = {},
        currentLn = config.language || null,
        defaultLn = currentLn,
        checkLn = function (ln) {
            if (!terms[ln]) {
                terms[ln] = {};
            }
        };

    return {

        getTerms: function (ln) {
            checkLn(ln);
            return terms[ln];
        },

        addTerms: function (ln, ts) {
            lodash.assign(this.getTerms(ln), ts);
            return this;
        },

        addTerm: function (ln, key, value) {
            this.getTerms(ln)[key] = value;
            return this;
        },

        setLanguage: function (ln) {
            currentLn = ln;
            return this;
        },

        getLanguage: function () {
            return currentLn;
        },

        get: function (key, useDefault) {
            if (useDefault === undefined) {
                useDefault = true;
            }
            var term = this.getTerms(currentLn)[key];
            return term || (useDefault && this.getTerms(defaultLn)[key]);
        }
    };
});