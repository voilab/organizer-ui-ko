/*jslint browser: true */
/*global define */

define(['knockout', 'kopostbox'], function (ko) {
    'use strict';

    /**
     * Extension for observable arrays to allow to add multiple entries
     * without triggering the view updater.
     *
     * @param {Array} valuesToPush
     * @returns {ko.observableArray}
     */
    ko.observableArray.fn.pushAll = function (valuesToPush) {
        // get underlying (real) array
        var underlyingArray = this();
        // silent the view updater
        this.valueWillMutate();
        // add entries
        ko.utils.arrayPushAll(underlyingArray, valuesToPush);
        // manually trigger the updater
        this.valueHasMutated();
        // return the observable array
        return this;
    };

});
