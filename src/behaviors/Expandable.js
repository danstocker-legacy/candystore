/*global dessert, troop, sntls, candystore */
troop.postpone(candystore, 'Expandable', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @name candystore.Expandable.create
     * @function
     * @returns {candystore.Expandable}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     */
    candystore.Expandable = self
        .addConstants(/** @lends candystore.Expandable */{
            /** @constants */
            EVENT_EXPAND: 'expand',

            /** @constants */
            EVENT_RETRACT: 'retract'
        })
        .addMethods(/** @lends candystore.Expandable# */{
            /** Call from host's init. */
            init: function () {
                this.retractWidget();
            },

            /** @returns {candystore.Expandable} */
            expandWidget: function () {
                this
                    .removeCssClass('widget-retracted')
                    .addCssClass('widget-expanded');

                this.triggerSync(this.EVENT_EXPAND);

                return this;
            },

            /** @returns {candystore.Expandable} */
            retractWidget: function () {
                this
                    .removeCssClass('widget-expanded')
                    .addCssClass('widget-retracted');

                this.triggerSync(this.EVENT_RETRACT);

                return this;
            },

            /** @returns {boolean} */
            isExpanded: function () {
                return this.hasCssClass('widget-expanded');
            }
        });
});
