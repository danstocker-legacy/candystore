/*global dessert, troop, sntls, candystore */
troop.postpone(candystore, 'BinaryStateful', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The BinaryStateful trait manages multiple binary states with different controlling sources.
     * A binary state may take two values: true or false, but that value is potentially controlled by
     * a number of sources. A particular binary state may be turned on by any of the sources,
     * however, all sources must release it to be turned off.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     */
    candystore.BinaryStateful = self
        .addConstants(/** @lends candystore.BinaryStateful */{
            /** @constant */
            SOURCE_PARENT_IMPOSED: 'parent-imposed'
        })
        .addPrivateMethods(/** @lends candystore.BinaryStateful# */{
            /**
             * Adds specified controlling source to the specified state.
             * @param {string} stateName
             * @param {string} sourceId
             * @private
             */
            _addStateSource: function (stateName, sourceId) {
                var sources = this.getStateSources(stateName),
                    sourceCountBefore = sources.getKeyCount(),
                    sourceCountAfter;

                sources.setItem(sourceId, true);

                sourceCountAfter = sources.getKeyCount();

                if (sourceCountBefore === 0 && sourceCountAfter > 0) {
                    // source count increased to non-zero
                    // state just got turned on
                    this.afterStateOn(stateName);
                }
            },

            /**
             * Removes specified controlling source from the specified state.
             * @param {string} stateName
             * @param {string} [sourceId]
             * @private
             */
            _removeStateSource: function (stateName, sourceId) {
                var sources = this.getStateSources(stateName),
                    sourceCountBefore = sources.getKeyCount(),
                    sourceCountAfter;

                if (typeof sourceId === 'string') {
                    sources.deleteItem(sourceId);
                } else {
                    sources.clear();
                }

                sourceCountAfter = sources.getKeyCount();

                if (sourceCountBefore > 0 && sourceCountAfter === 0) {
                    // source count decreased to zero
                    // state just got turned off
                    this.afterStateOff(stateName);
                }
            }
        })
        .addMethods(/** @lends candystore.BinaryStateful# */{
            /**
             * Call from host's init.
             */
            init: function () {
                /**
                 * Holds a collection of controlling sources for each binary state.
                 * @type {sntls.Collection}
                 */
                this.binaryStates = sntls.Collection.create();
            },

            /**
             * Call from host's .afterAdd
             */
            afterAdd: function () {
                var that = this;

                this.binaryStates
                    .forEachItem(function (sources, stateName) {
                        // initializing binary state
                        if (that.getState(stateName)) {
                            that.afterStateOn(stateName);
                        } else {
                            that.afterStateOff(stateName);
                        }

                        // querying nearest parent for matching state
                        var parent = that.getAncestor(function (widget) {
                            var binaryStates = widget.binaryStates;
                            return binaryStates && widget.hasState(stateName);
                        });

                        if (parent && parent.getState(stateName)) {
                            // enabling parent with matching binary state
                            that.addStateSource(stateName, that.SOURCE_PARENT_IMPOSED);
                        }
                    });
            },

            /**
             * Call from host's .afterRemove
             */
            afterRemove: function () {
                var that = this;

                // removing all parent imposed sources from all states
                this.binaryStates
                    .forEachItem(function (sources, stateName) {
                        that.removeStateSource(stateName, that.SOURCE_PARENT_IMPOSED);
                    });
            },

            /**
             * Adds a state to the widget. Only those states may be controlled on a widget
             * that have been added previously.
             * @param {string} stateName
             * @returns {candystore.BinaryStateful}
             */
            addState: function (stateName) {
                var binaryStateLayers = this.binaryStates;
                if (!binaryStateLayers.getItem(stateName)) {
                    binaryStateLayers.setItem(stateName, sntls.Collection.create());
                }
                return this;
            },

            /**
             * Tells whether the widget has the specified state.
             * @param {string} stateName
             * @returns {boolean}
             */
            hasState: function (stateName) {
                return !!this.binaryStates.getItem(stateName);
            },

            /**
             * Retrieves a collection of controlling states for the specified state.
             * @param {string} stateName
             * @returns {sntls.Collection}
             */
            getStateSources: function (stateName) {
                return this.binaryStates.getItem(stateName);
            },

            /**
             * Retrieves the (aggregated) value for the specified state. The value returned is true
             * when the state has at least one controlling source, and false when there are none.
             * @param {string} stateName
             * @returns {boolean}
             */
            getState: function (stateName) {
                return this.getStateSources(stateName).getKeyCount() > 0;
            },

            /**
             * Adds the specified source to the specified state.
             * @param {string} stateName
             * @param {string} sourceId
             * @returns {candystore.BinaryStateful}
             */
            addStateSource: function (stateName, sourceId) {
                // adding source to self
                this._addStateSource(stateName, sourceId);

                // adding source to suitable descendants
                this.getAllDescendants()
                    .filterBySelector(function (/**candystore.BinaryStateful*/descendant) {
                        return descendant.binaryStates && descendant.hasState(stateName);
                    })
                    .callOnEachItem('_addStateSource', stateName, this.SOURCE_PARENT_IMPOSED);

                return this;
            },

            /**
             * Removes the specified source from the specified state.
             * @param {string} stateName
             * @param {string} [sourceId]
             * @returns {candystore.BinaryStateful}
             */
            removeStateSource: function (stateName, sourceId) {
                // removing source from self
                this._removeStateSource(stateName, sourceId);

                // removing source from suitable descendants
                this.getAllDescendants()
                    .filterBySelector(function (/**candystore.BinaryStateful*/descendant) {
                        return descendant.binaryStates && descendant.hasState(stateName);
                    })
                    .callOnEachItem('_removeStateSource', stateName, sourceId && this.SOURCE_PARENT_IMPOSED);

                return this;
            }
        });

    /**
     * @name candystore.BinaryStateful#afterStateOn
     * @function
     * @param {string} stateName
     */

    /**
     * @name candystore.BinaryStateful#afterStateOff
     * @function
     * @param {string} stateName
     */
});
