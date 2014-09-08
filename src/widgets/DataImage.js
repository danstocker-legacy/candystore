/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataImage', function (ns, className) {
    "use strict";

    var base = candystore.Image,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget);

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
        .addPrivateMethods(/** @lends candystore.DataImage# */{
            /** @private */
            _updateImageUrl: function () {
                this.setImageUrl(this.entityKey.toField().getValue());
            }
        })
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

                this._updateImageUrl();

                this
                    .bindToEntityNodeChange(this.entityKey, 'onImageChange')
                    .bindToEntityNodeChange(this.entityKey.documentKey, 'onDocumentReplace');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindAll();
            },

            /** @ignore */
            onImageChange: function () {
                this._updateImageUrl();
            },

            /** @ignore */
            onDocumentReplace: function () {
                this._updateImageUrl();
            }
        });
});
