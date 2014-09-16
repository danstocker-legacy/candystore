/*global dessert, troop, sntls, app */
troop.postpone(candystore, 'StringUtils', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @class
     * @extends troop.Base
     */
    candystore.StringUtils = self
        .addMethods(/** @lends candystore.StringUtils */{
            /**
             * @param {number} value
             * @param {number} targetLength
             * @returns {string}
             */
            padLeft: function (value, targetLength) {
                var asString = value.toString(),
                    length = asString.length;

                return length < targetLength ?
                    new Array(targetLength - length + 1).join('0') + asString :
                    asString.substr(-targetLength);
            }
        });
});