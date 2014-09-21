/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataDynamicImage', function (ns, className) {
    "use strict";

    var base = candystore.DynamicImage,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget)
            .addTraitAndExtend(candystore.FieldBound);

    /**
     * Creates a DataDynamicImage instance.
     * @name candystore.DataDynamicImage.create
     * @function
     * @param {bookworm.FieldKey} urlFieldKey Field holding image URL.
     * @returns {candystore.DataDynamicImage}
     */

    /**
     * @class
     * @extends candystore.DynamicImage
     */
    candystore.DataDynamicImage = self
        .addMethods(/** @lends candystore.DataDynamicImage# */{
            /**
             * @param {bookworm.FieldKey} urlFieldKey
             * @ignore
             */
            init: function (urlFieldKey) {
                dessert.isFieldKey(urlFieldKey, "Invalid field key");

                base.init.call(this);
                bookworm.EntityBound.init.call(this);
                candystore.EntityWidget.init.call(this, urlFieldKey);
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
             * @param {string} fieldValue
             * @returns {candystore.DataDynamicImage}
             * @ignore
             */
            setFieldValue: function (fieldValue) {
                this.setImageUrl(fieldValue.toImageUrl());
                return this;
            }
        });
});
