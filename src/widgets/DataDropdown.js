/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataDropdown', function (ns, className) {
    "use strict";

    var base = candystore.Dropdown,
        self = base.extend(className)
            .addTrait(candystore.EntityWidget);

    /**
     * Creates a DataDropdown instance.
     * @name candystore.DataDropdown.create
     * @function
     * @param {bookworm.FieldKey} fieldKey
     * @returns {candystore.DataDropdown}
     */

    /**
     * The DataDropdown extends the functionality of the Dropdown with a List that is bound to a field in the cache.
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

            /**
             * Creates a DataList for the dropdown to use as its internal option list.
             * To specify a custom DataList, you don't necessarily have to override the DataDropdown class,
             * only delegate a surrogate definition to candystore.DataList that points to your implementation.
             * @example
             * candystore.DataList.addSurrogate(myNameSpace, 'MyDataList', function (fieldKey) {
             *     return myCondition === true;
             * })
             * @returns {candystore.DataList}
             * @see candystore.Dropdown#spawnListWidget
             */
            spawnListWidget: function () {
                return candystore.DataList.create(this.entityKey);
            }
        });
});
