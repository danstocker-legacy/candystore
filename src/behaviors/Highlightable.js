/*global dessert, troop, sntls, shoeshine, candystore */
troop.postpone(candystore, 'Highlightable', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The Highlightable trait adds switchable highlight to widgets.
     * Expects to be added to Widget instances.
     * Expects the host to have the BinaryStateful trait applied.
     * Overrides BinaryStateful's methods, must be added *after* BinaryStateful, and on a different
     * prototype level (using addTraitAndExtend()).
     * @class
     * @extends troop.Base
     * @extends candystore.BinaryStateful
     * @extends shoeshine.Widget
     */
    candystore.Highlightable = self
        .addConstants(/** @lends candystore.Highlightable */{
            /** @constant */
            STATE_NAME_HIGHLIGHTABLE: 'state-highlightable'
        })
        .addPrivateMethods(/** @lends candystore.Highlightable# */{
            /**
             * TODO: Refactor to use Set.
             * @private
             */
            _updateHighlightedState: function () {
                // removing all previous highlights
                this.highlightIds
                    .passEachItemTo(this.removeCssClass, this);

                var highlightIds = this.getBinaryState(this.STATE_NAME_HIGHLIGHTABLE)
                    .getSourceIds()
                    .toCollection();

                // adding current highlights
                highlightIds.passEachItemTo(this.addCssClass, this);

                this.highlightIds = highlightIds;
            }
        })
        .addMethods(/** @lends candystore.Highlightable# */{
            /** Call from host's init. */
            init: function () {
                // highlightable state does not cascade
                this.addBinaryState(this.STATE_NAME_HIGHLIGHTABLE);

                /**
                 * Lookup of highlight identifiers currently assigned to the instance.
                 * @type {sntls.Collection}
                 */
                this.highlightIds = sntls.Collection.create();
            },

            /**
             * @param {string} stateName
             * @param {string} sourceId
             * @returns {candystore.Highlightable}
             */
            addBinaryStateSource: function (stateName, sourceId) {
                candystore.BinaryStateful.addBinaryStateSource.call(this, stateName, sourceId);
                if (stateName === this.STATE_NAME_HIGHLIGHTABLE) {
                    this._updateHighlightedState();
                }
                return this;
            },

            /**
             * @param {string} stateName
             * @returns {candystore.Highlightable}
             */
            addImposedStateSource: function (stateName) {
                candystore.BinaryStateful.addImposedStateSource.call(this, stateName);
                if (stateName === this.STATE_NAME_HIGHLIGHTABLE) {
                    this._updateHighlightedState();
                }
                return this;
            },

            /**
             * @param {string} stateName
             * @param {string} sourceId
             * @returns {candystore.Highlightable}
             */
            removeBinaryStateSource: function (stateName, sourceId) {
                candystore.BinaryStateful.removeBinaryStateSource.call(this, stateName, sourceId);
                if (stateName === this.STATE_NAME_HIGHLIGHTABLE) {
                    this._updateHighlightedState();
                }
                return this;
            },

            /**
             * @param {string} stateName
             * @returns {candystore.Highlightable}
             */
            removeImposedStateSource: function (stateName) {
                candystore.BinaryStateful.removeImposedStateSource.call(this, stateName);
                if (stateName === this.STATE_NAME_HIGHLIGHTABLE) {
                    this._updateHighlightedState();
                }
                return this;
            },

            /**
             * Dummy handler.
             * @param {string} stateName
             */
            afterStateOn: function (stateName) {
            },

            /**
             * Dummy handler.
             * @param {string} stateName
             */
            afterStateOff: function (stateName) {
            },

            /**
             * Marks widget as highlighted.
             * @param {string} [highlightId]
             * @returns {candystore.Highlightable}
             */
            highlightOn: function (highlightId) {
                dessert.isStringOptional(highlightId, "Invalid highlight ID");
                this.addBinaryStateSource(
                    this.STATE_NAME_HIGHLIGHTABLE,
                    highlightId || 'highlighted');
                return this;
            },

            /**
             * Marks widget as non-highlighted.
             * @param {string} [highlightId]
             * @returns {candystore.Highlightable}
             */
            highlightOff: function (highlightId) {
                dessert.isStringOptional(highlightId, "Invalid highlight ID");
                this.removeBinaryStateSource(
                    this.STATE_NAME_HIGHLIGHTABLE,
                    highlightId || 'highlighted');
                return this;
            },

            /**
             * Tells whether the widget is currently highlighted.
             * @param {string} [highlightId]
             * @returns {boolean}
             */
            isHighlighted: function (highlightId) {
                dessert.isStringOptional(highlightId, "Invalid highlight ID");
                return highlightId ?
                       this.getBinaryState(this.STATE_NAME_HIGHLIGHTABLE)
                           .hasSource(highlightId) :
                       this.isStateOn(this.STATE_NAME_HIGHLIGHTABLE);
            }
        });
});
