/*global dessert, troop, sntls, candystore */
troop.postpone(candystore, 'BinaryState', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name candystore.BinaryState.create
     * @function
     * @param {string} stateName
     * @returns {candystore.BinaryState}
     */

    /**
     * @class
     * @extends troop.Base
     */
    candystore.BinaryState = self
        .addMethods(/** @lends candystore.BinaryState# */{
            /**
             * @param {string} stateName
             * @ignore
             */
            init: function (stateName) {
                dessert.isString(stateName, "Invalid state name");

                /**
                 * Name of the state. Eg. "expandable".
                 * @type {string}
                 */
                this.stateName = stateName;

                /**
                 * Lookup of source identifiers controlling the state.
                 * @type {sntls.Collection}
                 */
                this.stateSources = sntls.Collection.create();

                /**
                 * Whether state can cascade, ie. be influenced by other states.
                 * @type {boolean}
                 */
                this.isCascading = false;
            },

            /**
             * @param {boolean} isCascading
             * @returns {candystore.BinaryState}
             */
            setIsCascading: function (isCascading) {
                this.isCascading = isCascading;
                return this;
            },

            /**
             * @param {string} sourceId
             * @returns {candystore.BinaryState}
             */
            addSource: function (sourceId) {
                this.stateSources.setItem(sourceId, true);
                return this;
            },

            /**
             * @param {string} [sourceId]
             * @returns {candystore.BinaryState}
             */
            removeSource: function (sourceId) {
                if (typeof sourceId === 'string') {
                    this.stateSources.deleteItem(sourceId);
                } else {
                    this.stateSources.clear();
                }
                return this;
            },

            /**
             * @returns {number}
             */
            getSourceCount: function () {
                return this.stateSources.getKeyCount();
            },

            /**
             * @returns {boolean}
             */
            isStateOn: function () {
                return this.stateSources.getKeyCount() > 0;
            },

            /**
             * @param {candystore.BinaryState} binaryState
             * @param {string} sourceId
             * @returns {candystore.BinaryState}
             */
            addStateAsSource: function (binaryState, sourceId) {
                dessert.isBinaryState(binaryState, "Invalid binary state");
                if (this.isCascading && binaryState.isStateOn()) {
                    this.addSource(sourceId);
                }
                return this;
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {candystore.BinaryState} expr */
        isBinaryState: function (expr) {
            return candystore.BinaryState.isBaseOf(expr);
        },

        /** @param {candystore.BinaryState} [expr] */
        isBinaryStateOptional: function (expr) {
            return typeof expr === 'undefined' ||
                   candystore.BinaryState.isBaseOf(expr);
        }
    });

    troop.Properties.addProperties.call(
        String.prototype,
        /** @lends String# */{
            /**
             * @returns {candystore.BinaryState}
             */
            toBinaryState: function () {
                return candystore.BinaryState.create(this.valueOf());
            }
        },
        false, false, false
    );
}());
