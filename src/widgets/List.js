/*global dessert, troop, sntls, shoeshine, candystore */
troop.postpone(candystore, 'List', function (ns, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * @name candystore.List.create
     * @function
     * @returns {candystore.List}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     */
    candystore.List = self
        .addMethods(/** @lends candystore.List# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('ul');
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.children.toString();
            },

            /**
             * @param itemWidget
             * @returns {candystore.List}
             */
            addItemWidget: function (itemWidget) {
                itemWidget
                    .setTagName('li')
                    .addToParent(this);

                return this;
            }
        });
});
