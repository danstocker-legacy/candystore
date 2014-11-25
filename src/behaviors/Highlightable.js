/*global dessert, troop, sntls, shoeshine, candystore */
troop.postpone(candystore, 'Highlightable', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The Highlightable trait adds switchable highlight to widgets.
     * Expects to be added to Widget instances.
     * Expects the host to have the BinaryStateful trait applied.
     * TODO: Add unit tests.
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
        .addPrivateMethods(/** @lends candystore.Disableable# */{
            /**
             * TODO: Refactor to use Set.
             * @private
             */
            _updateHighlightedStyle: function () {
                // removing all previous highlights
                this.highlightIds
                    .passEachItemTo(this.removeCssClass, this);

                // adding current highlights
                this.getBinaryState(this.STATE_NAME_HIGHLIGHTABLE)
                    .getSourceIds()
                    .toCollection()
                    .passEachItemTo(this.addCssClass, this);
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
                this.highlightIds = undefined;
            },

            /** Call from host's .afterAdd */
            afterAdd: function ( ){
                this.highlightIds = this.getBinaryState(this.STATE_NAME_HIGHLIGHTABLE)
                    .getSourceIds()
                    .toCollection();
                this._updateHighlightedStyle();
            },

            /** Call from host's .afterRemove */
            afterRemove: function () {
                // adding current highlights
                this.highlightIds
                    .passEachItemTo(this.removeCssClass, this);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                if (stateName === this.STATE_NAME_HIGHLIGHTABLE) {
                    this._updateHighlightedStyle();
                }
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                if (stateName === this.STATE_NAME_HIGHLIGHTABLE) {
                    this._updateHighlightedStyle();
                }
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
