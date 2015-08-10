/*jslint browser: true */
/*global require */

require.config({
    urlArgs: 'v=0.0.1',
    baseUrl: '.',

    deps: ['app/main'],

    paths: {
        jquery: 'vendor/jquery/dist/jquery',
        twitterBootstrap: 'vendor/bootstrap/dist/js/bootstrap',
        bootstrapTags: 'vendor/bootstrap-tagsinput/dist/bootstrap-tagsinput',
        typeahead: 'vendor/typeahead.js/dist/typeahead.jquery',
        lodash: 'vendor/lodash/dist/lodash',
        text: 'vendor/requirejs-text/text',
        knockout: 'vendor/knockout/dist/knockout',
        kopostbox: 'vendor/knockout-postbox/build/knockout-postbox'
    },

    shim: {
        bootstrapTags: ['twitterBootstrap'],
        twitterBootstrap: ['jquery'],
        typeahead: ['jquery']
    }
});