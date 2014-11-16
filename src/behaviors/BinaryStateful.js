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
             * Does not consider previous state, only current one.
             * @param {string} layerName
             * @private
             */
            _updateStateLayer: function (layerName) {
                if (this.getLayerState(layerName)) {
                    this.afterEnableState(layerName);
                } else {
                    this.afterDisableState(layerName);
                }
            },

            /**
             * Enables state and calls after handler.
             * @param {string} layerName
             * @param {string} sourceId
             * @private
             */
            _enableState: function (layerName, sourceId) {
                var sources = this.getLayerSources(layerName),
                    sourceCountBefore = sources.getKeyCount(),
                    sourceCountAfter;

                sources.setItem(sourceId, true);

                sourceCountAfter = sources.getKeyCount();

                if (sourceCountBefore === 0 && sourceCountAfter > 0) {
                    // source count increased to non-zero
                    // state just became enabled
                    this.afterEnableState(layerName);
                }
            },

            /**
             * Enables state and calls after handler.
             * @param {string} layerName
             * @param {string} [sourceId]
             * @private
             */
            _disableState: function (layerName, sourceId) {
                var sources = this.getLayerSources(layerName),
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
                    // state just became disabled
                    this.afterDisableState(layerName);
                }
            }
        })
        .addMethods(/** @lends candystore.BinaryStateful# */{
            /**
             * Call from host's init.
             */
            init: function () {
                /** @type {sntls.Collection} */
                this.binaryStateLayers = sntls.Collection.create();
            },

            /**
             * Call from host's .afterAdd
             */
            afterAdd: function () {
                var that = this;

                // querying nearest parent and enabling all matching states
                this.binaryStateLayers
                    .forEachItem(function (states, layerName) {
                        that._updateStateLayer(layerName);

                        var parent = that.getAncestor(function (widget) {
                            var binaryStateLayers = widget.binaryStateLayers;
                            return binaryStateLayers && that.hasStateLayer(layerName);
                        });

                        if (parent && parent.getLayerState(layerName)) {
                            that.enableState(layerName, that.SOURCE_PARENT_IMPOSED);
                        }
                    });
            },

            /**
             * Call from host's .afterRemove
             */
            afterRemove: function () {
                var that = this;

                // disabling all parent imposed sources on all layers
                this.binaryStateLayers
                    .forEachItem(function (sources, layerName) {
                        that.disableState(layerName, that.SOURCE_PARENT_IMPOSED);
                    });
            },

            /**
             * @param {string} layerName
             * @returns {candystore.BinaryStateful}
             */
            addStateLayer: function (layerName) {
                var binaryStateLayers = this.binaryStateLayers;
                if (!binaryStateLayers.getItem(layerName)) {
                    binaryStateLayers.setItem(layerName, sntls.Collection.create());
                }
                return this;
            },

            /**
             * @param {string} layerName
             * @returns {boolean}
             */
            hasStateLayer: function (layerName) {
                return !!this.binaryStateLayers.getItem(layerName);
            },

            /**
             * @param {string} layerName
             * @returns {sntls.Collection}
             */
            getLayerSources: function (layerName) {
                return this.binaryStateLayers.getItem(layerName);
            },

            /**
             * @param {string} layerName
             * @returns {boolean}
             */
            getLayerState: function (layerName) {
                return this.getLayerSources(layerName).getKeyCount() > 0;
            },

            /**
             * @param {string} layerName
             * @param {string} sourceId
             * @returns {candystore.BinaryStateful}
             */
            enableState: function (layerName, sourceId) {
                // enabling state for self
                this._enableState(layerName, sourceId);

                // enabling state for descendants
                this.getAllDescendants()
                    .filterBySelector(function (/**candystore.BinaryStateful*/descendant) {
                        return descendant.binaryStateLayers && descendant.hasStateLayer(layerName);
                    })
                    .callOnEachItem('_enableState', layerName, this.SOURCE_PARENT_IMPOSED);

                return this;
            },

            /**
             * @param {string} layerName
             * @param {string} sourceId
             * @returns {candystore.BinaryStateful}
             */
            disableState: function (layerName, sourceId) {
                // enabling state for self
                this._disableState(layerName, sourceId);

                // enabling state for descendants
                this.getAllDescendants()
                    .filterBySelector(function (/**candystore.BinaryStateful*/descendant) {
                        return descendant.binaryStateLayers && descendant.hasStateLayer(layerName);
                    })
                    .callOnEachItem('_disableState', layerName, this.SOURCE_PARENT_IMPOSED);

                return this;
            }
        });

    /**
     * @name candystore.BinaryStateful#afterEnableState
     * @function
     * @param {string} layerName
     */

    /**
     * @name candystore.BinaryStateful#afterDisableState
     * @function
     * @param {string} layerName
     */
});
