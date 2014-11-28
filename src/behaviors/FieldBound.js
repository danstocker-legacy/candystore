/*global dessert, troop, sntls, evan, shoeshine, candystore */
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
     * The FieldBound trait adds a callback method to the host class that is invoked each time the value at
     * the field key associated with the host class changes.
     * Expects to be added to widgets that also have the EntityBound and EntityWidget traits.
     * @class
     * @extends troop.Base
     * @extends bookworm.EntityBound
     * @extends shoeshine.EntityWidget
     * @extends shoeshine.Widget
     */
    candystore.FieldBound = self
        .addPrivateMethods(/** @lends candystore.FieldBound# */{
            /** @private */
            _updateFieldValue: function () {
                var fieldValue = this.entityKey.toField().getValue();
                this.setFieldValue(fieldValue);
            }
        })
        .addMethods(/** @lends candystore.FieldBound# */{
            /** Call from host's afterAdd. */
            afterAdd: function () {
                this._updateFieldValue();
                this
                    .bindToEntityNodeChange(this.entityKey.documentKey, 'onDocumentReplace')
                    .bindToEntityNodeChange(this.entityKey, 'onFieldChange');
            },

            /** Call from host's afterRemove. */
            afterRemove: function () {
                this
                    .unbindFromEntityChange(this.entityKey.documentKey)
                    .unbindFromEntityChange(this.entityKey);
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onDocumentReplace: function (event) {
                this.setNextOriginalEvent(event);
                this._updateFieldValue();
                this.clearNextOriginalEvent();
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onFieldChange: function (event) {
                this.setNextOriginalEvent(event);
                this._updateFieldValue();
                this.clearNextOriginalEvent();
            }
        });
});
