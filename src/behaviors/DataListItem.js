/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'DataListItem', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The DataListItem trait associates widgets with an item key.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     */
    candystore.DataListItem = self
        .addMethods(/** @lends candystore.DataListItem# */{
            /**
             * Call from host's init.
             * @param {bookworm.ItemKey} [itemKey]
             */
            init: function (itemKey) {
                /** @type {bookworm.ItemKey} */
                this.itemKey = itemKey;
            },

            /**
             * Associates item widget with an item key.
             * @param {bookworm.ItemKey} itemKey
             * @returns {candystore.DataListItem}
             */
            setItemKey: function (itemKey) {
                dessert.isItemKey(itemKey, "Invalid item key");
                this.itemKey = itemKey;
                return this;
            }
        });
}, jQuery);
