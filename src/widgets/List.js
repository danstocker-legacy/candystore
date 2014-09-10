/*global dessert, troop, sntls, shoeshine, candystore */
troop.postpone(candystore, 'List', function (ns, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * Creates a List instance.
     * @name candystore.List.create
     * @function
     * @returns {candystore.List}
     */

    /**
     * The List is an aggregation of other widgets.
     * By default, it maps to the <em>ul</em> and <em>li</em> HTML elements, but that can be changed by subclassing.
     * Item order follows the normal ordering child widgets, ie. in the order of their names.
     * @class
     * @extends shoeshine.Widget
     */
    candystore.List = self
        .addConstants(/** @lends candystore.List */{
            /** @constant */
            EVENT_LIST_ITEMS_CHANGE: 'list-items-change'
        })
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
             * Adds a widget to the list as its item.
             * Changes the specified widget's tag name to 'li'.
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
