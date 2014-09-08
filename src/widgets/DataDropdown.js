/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataDropdown', function (ns, className) {
    "use strict";

    var base = candystore.Dropdown,
        self = base.extend(className)
            .addTrait(candystore.EntityWidget);

    /**
     * @name candystore.DataDropdown.create
     * @function
     * @param {bookworm.FieldKey} fieldKey
     * @returns {candystore.DataDropdown}
     */

    /**
     * @class
     * @extends candystore.Dropdown
     * @extends candystore.EntityWidget
     */
    candystore.DataDropdown = self
        .addMethods(/** @lends candystore.DataDropdown# */{
            /**
             * @param {bookworm.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                candystore.EntityWidget.init.call(this, fieldKey);
                base.init.call(this);
            },

            /** @returns {candystore.DataList} */
            createListWidget: function () {
                return candystore.DataList.create(this.entityKey);
            }
        });
});
