/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataLabel', function (ns, className) {
    "use strict";

    var base = candystore.Label,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget);

    /**
     * @name candystore.DataLabel.create
     * @function
     * @param {bookworm.FieldKey} textFieldKey Field holding text.
     * @returns {candystore.DataLabel}
     */

    /**
     * @class
     * @extends candystore.Label
     * @extends bookworm.EntityBound
     * @extends candystore.EntityWidget
     */
    candystore.DataLabel = self
        .addPrivateMethods(/** @lends candystore.DataLabel# */{
            /** @private */
            _updateLabelText: function () {
                this.setLabelText(this.entityKey.toField().getValue().toString());
            }
        })
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

                this._updateLabelText();

                this
                    .bindToEntityNodeChange(this.entityKey, 'onTextChange')
                    .bindToEntityNodeChange(this.entityKey.documentKey, 'onTextChange');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindAll();
            },

            /** @ignore */
            onTextChange: function () {
                this._updateLabelText();
            },

            /** @ignore */
            onDocumentReplace: function () {
                this._updateLabelText();
            }
        });
});
