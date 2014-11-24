/*global dessert, troop, sntls, shoeshine, candystore */
troop.postpone(candystore, 'BinaryStateful', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The BinaryStateful trait manages multiple binary states with multiple contributing sources.
     * TODO: Add method for changing cascading flag, re-evaluating any imposed states.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     * @see candystore.BinaryState
     */
    candystore.BinaryStateful = self
        .addConstants(/** @lends candystore.BinaryStateful */{
            /**
             * Identifier prefix for imposed sources.
             * @constant
             */
            SOURCE_IMPOSED_PREFIX: 'imposed'
        })
        .addPrivateMethods(/** @lends candystore.BinaryStateful# */{
            /**
             * @param {number} instanceId
             * @returns {string}
             * @private
             */
            _getImposedSourceId: function (instanceId) {
                return this.SOURCE_IMPOSED_PREFIX + '-' + instanceId;
            },

            /**
             * Adds specified contributing source to the specified state.
             * TODO: Separate setting imposed source.
             * @param {string} stateName
             * @param {string|candystore.BinaryStateful} sourceId
             * @private
             */
            _addStateSource: function (stateName, sourceId) {
                var state = this.getBinaryState(stateName),
                    sourceIdsBefore = state.getSourceIds(),
                    sourceCountBefore = state.getSourceCount(),
                    sourceCountAfter;

                if (sourceId.binaryStates) {
                    state.addStateAsSource(
                        sourceId.getBinaryState(stateName),
                        this._getImposedSourceId(sourceId.instanceId));
                } else {
                    state.addSource(sourceId);
                }

                sourceCountAfter = state.getSourceCount();

                if (sourceCountBefore === 0 && sourceCountAfter > 0) {
                    // source count increased to non-zero
                    // state just got turned on
                    this.afterStateOn(stateName, sourceIdsBefore);
                }
            },

            /**
             * Removes specified contributing source from the specified state.
             * @param {string} stateName
             * @param {string} [sourceId]
             * @private
             */
            _removeStateSource: function (stateName, sourceId) {
                var state = this.getBinaryState(stateName),
                    sourceIdsBefore = state.getSourceIds(),
                    sourceCountBefore = state.getSourceCount(),
                    sourceCountAfter;

                state.removeSource(sourceId);

                sourceCountAfter = state.getSourceCount();

                if (sourceCountBefore > 0 && sourceCountAfter === 0) {
                    // source count decreased to zero
                    // state just got turned off
                    this.afterStateOff(stateName, sourceIdsBefore);
                }
            },

            /**
             * @param {string} stateName
             * @private
             */
            _applyImposedSources: function (stateName) {
                // querying nearest parent for matching state
                var parent = this.getAncestor(function (widget) {
                    var binaryStates = widget.binaryStates;
                    return binaryStates && widget.getBinaryState(stateName);
                });

                if (parent && parent.isStateOn(stateName)) {
                    // enabling parent with matching binary state
                    this.getBinaryState(stateName)
                        .addStateAsSource(
                            parent.getBinaryState(stateName),
                            this._getImposedSourceId(parent.instanceId));
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
                        // checking whether any of the parents have matching states set
                        that._applyImposedSources(stateName);

                        var state = that.getBinaryState(stateName),
                            sourceIdsBefore = state.getSourceIds();

                        // initializing binary state
                        if (state.isStateOn()) {
                            that.afterStateOn(stateName, sourceIdsBefore);
                        } else {
                            that.afterStateOff(stateName, sourceIdsBefore);
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
                    .forEachItem(function (binaryState, stateName) {
                        binaryState.stateSources
                            // fetching imposed source IDs
                            .filterByPrefix(that.SOURCE_IMPOSED_PREFIX)
                            .getKeysAsHash()
                            .toCollection()

                            // removing them from current stateful instance
                            .passEachItemTo(that.removeBinaryStateSource, that, 1, stateName);
                    });
            },

            /**
             * Adds a state to the widget. A state must be added before it can be manipulated.
             * @param {string} stateName Identifies the state.
             * @param {boolean} [isCascading=false] Whether new state is cascading.
             * @returns {candystore.BinaryStateful}
             */
            addBinaryState: function (stateName, isCascading) {
                var binaryStateLayers = this.binaryStates;
                if (!binaryStateLayers.getItem(stateName)) {
                    binaryStateLayers.setItem(
                        stateName,
                        stateName.toBinaryState()
                            .setIsCascading(isCascading));
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
             * Determines whether the specified state evaluates to true.
             * @param {string} stateName Identifies state.
             * @returns {boolean}
             */
            isStateOn: function (stateName) {
                return this.binaryStates.getItem(stateName).isStateOn();
            },

            /**
             * Adds the specified contributing source to the specified state.
             * TODO: Add unit test for _addStateSource arguments.
             * @param {string} stateName Identifies state.
             * @param {string} sourceId Identifies source.
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
                    .callOnEachItem('_addStateSource', stateName, this);

                return this;
            },

            /**
             * Removes the specified source from the specified state.
             * @param {string} stateName Identifies state.
             * @param {string} [sourceId] Identifies source. When omitted, all sources will be
             * removed.
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
                    .callOnEachItem(
                        '_removeStateSource',
                        stateName,
                        sourceId && this._getImposedSourceId(this.instanceId));

                return this;
            }
        });

    /**
     * Called after the state value changes from false to true.
     * @name candystore.BinaryStateful#afterStateOn
     * @function
     * @param {string} stateName
     * @param {string[]} sourceIdsBefore
     */

    /**
     * Called after the state value changes from true to false.
     * @name candystore.BinaryStateful#afterStateOff
     * @function
     * @param {string} stateName
     * @param {string[]} sourceIdsBefore
     */
});
