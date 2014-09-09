/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataImage', function (ns, className) {
    "use strict";

    var base = candystore.Image,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget)
            .addTraitAndExtend(candystore.FieldBound);

    /**
     * @name candystore.DataImage.create
     * @function
     * @param {bookworm.FieldKey} urlFieldKey Field holding image URL.
     * @returns {candystore.DataImage}
     */

    /**
     * @class
     * @extends candystore.Image
     * @extends bookworm.EntityBound
     * @extends candystore.EntityWidget
     */
    candystore.DataImage = self
        .addMethods(/** @lends candystore.DataImage# */{
            /**
             * @param {bookworm.FieldKey} urlFieldKey
             * @ignore
             */
            init: function (urlFieldKey) {
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
             * @returns {candystore.DataImage}
             */
            setFieldValue: function (fieldValue) {
                this.setImageUrl(fieldValue);
                return this;
            }
        });
});
