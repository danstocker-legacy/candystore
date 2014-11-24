/*global dessert, troop, sntls, candystore */
troop.postpone(candystore, 'BinaryState', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Creates a BinaryState instance.
     * @name candystore.BinaryState.create
     * @function
     * @param {string} stateName Identifies the binary state.
     * @returns {candystore.BinaryState}
     * @see String#toBinaryState
     */

    /**
     * The BinaryState implements a named state that can take two values: true or false,
     * but which value depends on the number of sources contributing the state.
     * The value is false when no source contributes the state, true otherwise.
     * TODO: Remove .addStateAsSource.
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
                 * Lookup of source identifiers contributing the state.
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
             * Adds the specified source to the state.
             * @param {string} sourceId Identifies the contributing source.
             * @returns {candystore.BinaryState}
             */
            addSource: function (sourceId) {
                this.stateSources.setItem(sourceId, true);
                return this;
            },

            /**
             * Removes the specified source.
             * @param {string} [sourceId] Identifies the contributing source.
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
             * Tells whether the specified state contributes to the state.
             * @param {string} sourceId
             * @returns {boolean}
             */
            hasSource: function (sourceId) {
                return this.stateSources.getItem(sourceId);
            },

            /**
             * Retrieves the identifiers of all contributing sources.
             * @returns {string[]}
             */
            getSourceIds: function () {
                return this.stateSources.getKeys();
            },

            /**
             * Determines the number of contributing sources.
             * @returns {number}
             */
            getSourceCount: function () {
                return this.stateSources.getKeyCount();
            },

            /**
             * Determines whether the state value is true, ie. there is at leas one source
             * contributing.
             * @returns {boolean}
             */
            isStateOn: function () {
                return this.stateSources.getKeyCount() > 0;
            },

            /**
             * Adds another state as contributing source.
             * Takes effect only if state is cascading.
             * TODO: Remove, and place logic in classes that use BinaryState.
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
