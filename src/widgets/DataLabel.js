/*global dessert, troop, sntls, b$, s$, app */
troop.postpone(app.widgets, 'DataLabel', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = widgets.Label,
        self = base.extend(className)
            .addTrait(b$.EntityBound)
            .addTrait(widgets.EntityWidget);

    /**
     * @name app.widgets.DataLabel.create
     * @function
     * @param {bookworm.FieldKey} textFieldKey Field holding text.
     * @returns {app.widgets.DataLabel}
     */

    /**
     * @class
     * @extends app.widgets.Label
     * @extends bookworm.EntityBound
     * @extends app.widgets.EntityWidget
     */
    app.widgets.DataLabel = self
        .addPrivateMethods(/** @lends app.widgets.DataLabel# */{
            /** @private */
            _updateLabelText: function () {
                this.setLabelText(this.entityKey.toField().getValue().toString());
            }
        })
        .addMethods(/** @lends app.widgets.DataLabel# */{
            /**
             * @param {bookworm.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                dessert.isFieldKey(fieldKey, "Invalid field key");

                base.init.call(this);
                b$.EntityBound.init.call(this);
                widgets.EntityWidget.init.call(this, fieldKey);
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
