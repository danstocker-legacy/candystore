/*global dessert, troop, sntls, shoeshine, candystore */
troop.postpone(candystore, 'Highlightable', function (ns, className) {
    "use strict";

    var base = troop.Base,
        self = base.extend(className);

    /**
     * The Highlightable trait adds
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     */
    candystore.Highlightable = self
        .addMethods(/** @lends candystore.Highlightable# */{
            /**
             * Call from host's init.
             */
            init: function () {
                /**
                 * Registry of highlight identifiers the widget is *currently* highlighted by.
                 * @type {sntls.Collection}
                 */
                this.highlightIds = sntls.Collection.create();
            },

            /**
             * Marks widget as highlighted.
             * @param {string} [highlightId]
             * @returns {candystore.Highlightable}
             */
            highlightOn: function (highlightId) {
                dessert.isStringOptional(highlightId, "Invalid highlight ID");

                highlightId = highlightId || 'highlighted';

                this.addCssClass(highlightId);
                this.highlightIds.setItem(highlightId, highlightId);

                return this;
            },

            /**
             * Marks widget as non-highlighted.
             * @param {string} [highlightId]
             * @returns {candystore.Highlightable}
             */
            highlightOff: function (highlightId) {
                dessert.isStringOptional(highlightId, "Invalid highlight ID");

                highlightId = highlightId || 'highlighted';

                this.removeCssClass(highlightId);
                this.highlightIds.deleteItem(highlightId);

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
                    !!this.getItem(highlightId) :
                    !!this.highlightIds.getKeyCount();
            }
        });
});
