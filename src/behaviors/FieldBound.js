/*global dessert, troop, sntls, e$, s$, app */
troop.postpone(candystore, 'FieldBound', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Effectuates field value change on widget.
     * Implement in host class.
     * @name candystore.FieldBound#setFieldValue
     * @function
     * @param {*} fieldValue
     * @returns {candystore.FieldBound}
     */

    /**
     * Expects to be added to Input widgets that also have the EntityBound and EntityWidget traits.
     * @class
     * @extends troop.Base
     * @extends bookworm.EntityBound
     * @extends shoeshine.EntityWidget
     * @extends shoeshine.Widget
     */
    candystore.FieldBound = self
        .addPrivateMethods(/** @lends candystore.FieldBound# */{
            /** @private */
            _updateInputValue: function () {
                var fieldValue = this.entityKey.toField().getValue();
                this.setFieldValue(fieldValue);
            },

            /**
             * @private */
            _onDocumentReplace: function () {
                this._updateInputValue();
            },

            /** @private */
            _onFieldChange: function () {
                this._updateInputValue();
            }
        })
        .addMethods(/** @lends candystore.FieldBound# */{
            /**
             * Call from host's afterAdd.
             */
            afterAdd: function () {
                this._updateInputValue();
                this
                    .bindToEntityNodeChange(this.entityKey.documentKey, '_onDocumentReplace')
                    .bindToEntityNodeChange(this.entityKey, '_onFieldChange');
            },

            /**
             * Call from host's afterRemove.
             */
            afterRemove: function () {
                this
                    .unbindFromEntityChange(this.entityKey.documentKey)
                    .unbindFromEntityChange(this.entityKey);
            }
        });
});
