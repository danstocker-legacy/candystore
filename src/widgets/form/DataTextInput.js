/*global dessert, troop, sntls, evan, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataTextInput', function (ns, className) {
    "use strict";

    var base = candystore.TextInput,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget)
            .addTraitAndExtend(candystore.FieldBound);

    /**
     * Creates a DataTextInput instance.
     * @name candystore.DataTextInput.create
     * @function
     * @param {bookworm.FieldKey} inputFieldKey
     * @returns {candystore.DataTextInput}
     */

    /**
     * The DataTextInput adds data binding to TextInput, reflecting the value of a field in the cache.
     * Keeps the value of the input field in sync with the changes of the cache field.
     * @class
     * @extends candystore.TextInput
     * @extends bookworm.EntityBound
     * @extends candystore.EntityWidget
     * @extends candystore.FieldBound
     */
    candystore.DataTextInput = self
        .addMethods(/** @lends candystore.DataTextInput# */{
            /**
             * @param {bookworm.FieldKey} inputFieldKey
             * @ignore
             */
            init: function (inputFieldKey) {
                base.init.call(this);
                bookworm.EntityBound.init.call(this);
                candystore.EntityWidget.init.call(this, inputFieldKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                candystore.FieldBound.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                candystore.FieldBound.afterRemove.call(this);
            },

            /**
             * @param {*} fieldValue
             * @returns {candystore.DataTextInput}
             * @ignore
             */
            setFieldValue: function (fieldValue) {
                this.setInputValue(String(fieldValue || ''), true);
                return this;
            }
        });
});
