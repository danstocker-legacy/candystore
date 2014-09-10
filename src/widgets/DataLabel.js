/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataLabel', function (ns, className) {
    "use strict";

    var base = candystore.Label,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget)
            .addTraitAndExtend(candystore.FieldBound);

    /**
     * Creates a DataLabel instance.
     * @name candystore.DataLabel.create
     * @function
     * @param {bookworm.FieldKey} textFieldKey Key to a text field.
     * @returns {candystore.DataLabel}
     */

    /**
     * The DataLabel displays text based on the value of a field in the cache.
     * Keeps the text in sync with the changes of the corresponding field.
     * @class
     * @extends candystore.Label
     * @extends bookworm.EntityBound
     * @extends candystore.EntityWidget
     * @extends candystore.FieldBound
     */
    candystore.DataLabel = self
        .addMethods(/** @lends candystore.DataLabel# */{
            /**
             * @param {bookworm.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                dessert.isFieldKey(fieldKey, "Invalid field key");

                base.init.call(this);
                bookworm.EntityBound.init.call(this);
                candystore.EntityWidget.init.call(this, fieldKey);
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
             * @returns {candystore.DataLabel}
             * @ignore
             */
            setFieldValue: function (fieldValue) {
                this.setLabelText(String(fieldValue));
                return this;
            }
        });
});
