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
             * @param {string|candystore.BinaryState} sourceId
             * @private
             */
            _addStateSource: function (stateName, sourceId) {
                var state = this.getBinaryState(stateName),
                    sourceCountBefore = state.getSourceCount(),
                    sourceCountAfter;

                if (candystore.BinaryState.isBaseOf(sourceId)) {
                    state.addStateAsSource(sourceId, this.SOURCE_PARENT_IMPOSED);
                } else {
                    state.addSource(sourceId);
                }

                sourceCountAfter = state.getSourceCount();

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
                var state = this.getBinaryState(stateName),
                    sourceCountBefore = state.getSourceCount(),
                    sourceCountAfter;

                state.removeSource(sourceId);

                sourceCountAfter = state.getSourceCount();

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
                 * Holds a collection of BinaryState instances for each binary state.
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
                        if (that.isStateOn(stateName)) {
                            that.afterStateOn(stateName);
                        } else {
                            that.afterStateOff(stateName);
                        }

                        // querying nearest parent for matching state
                        var parent = that.getAncestor(function (widget) {
                            var binaryStates = widget.binaryStates;
                            return binaryStates && widget.getBinaryState(stateName);
                        });

                        if (parent && parent.isStateOn(stateName)) {
                            // enabling parent with matching binary state
                            that.getBinaryState(stateName)
                                .addStateAsSource(
                                    parent.getBinaryState(stateName),
                                    that.SOURCE_PARENT_IMPOSED);
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
                        that.removeBinaryStateSource(stateName, that.SOURCE_PARENT_IMPOSED);
                    });
            },

            /**
             * Adds a state to the widget. Only those states may be controlled on a widget
             * that have been added previously.
             * @param {string} stateName
             * @param {boolean} [inheritsFromParent]
             * @returns {candystore.BinaryStateful}
             */
            addBinaryState: function (stateName, inheritsFromParent) {
                var binaryStateLayers = this.binaryStates;
                if (!binaryStateLayers.getItem(stateName)) {
                    binaryStateLayers.setItem(
                        stateName,
                        stateName.toBinaryState()
                            .setIsCascading(inheritsFromParent));
                }
                return this;
            },

            /**
             * @param {string} stateName
             * @returns {candystore.BinaryState}
             */
            getBinaryState: function (stateName) {
                return this.binaryStates.getItem(stateName);
            },

            /**
             * Retrieves the (aggregated) value for the specified state. The value returned is true
             * when the state has at least one controlling source, and false when there are none.
             * @param {string} stateName
             * @returns {boolean}
             */
            isStateOn: function (stateName) {
                return this.binaryStates.getItem(stateName).isStateOn();
            },

            /**
             * Adds the specified source to the specified state.
             * TODO: Add unit test for _addStateSource arguments.
             * @param {string} stateName
             * @param {string} sourceId
             * @returns {candystore.BinaryStateful}
             */
            addBinaryStateSource: function (stateName, sourceId) {
                // adding source to self
                this._addStateSource(stateName, sourceId);

                // adding source to suitable descendants
                this.getAllDescendants()
                    .filterBySelector(function (/**candystore.BinaryStateful*/descendant) {
                        return descendant.binaryStates && descendant.getBinaryState(stateName);
                    })
                    .callOnEachItem('_addStateSource', stateName, this.getBinaryState(stateName));

                return this;
            },

            /**
             * Removes the specified source from the specified state.
             * @param {string} stateName
             * @param {string} [sourceId]
             * @returns {candystore.BinaryStateful}
             */
            removeBinaryStateSource: function (stateName, sourceId) {
                // removing source from self
                this._removeStateSource(stateName, sourceId);

                // removing source from suitable descendants
                this.getAllDescendants()
                    .filterBySelector(function (/**candystore.BinaryStateful*/descendant) {
                        return descendant.binaryStates && descendant.getBinaryState(stateName);
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
