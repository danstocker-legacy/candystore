/*global dessert, troop, sntls, b$, s$, app */
troop.postpone(app.widgets, 'DataImage', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = app.widgets.Image,
        self = base.extend(className)
            .addTrait(b$.EntityBound)
            .addTrait(widgets.EntityWidget);

    /**
     * @name app.widgets.DataImage.create
     * @function
     * @param {bookworm.FieldKey} urlFieldKey Field holding image URL.
     * @returns {app.widgets.DataImage}
     */

    /**
     * @class
     * @extends app.widgets.Image
     * @extends bookworm.EntityBound
     * @extends app.widgets.EntityWidget
     */
    app.widgets.DataImage = self
        .addPrivateMethods(/** @lends app.widgets.DataImage# */{
            /** @private */
            _updateImageUrl: function () {
                this.setImageUrl(this.entityKey.toField().getValue());
            }
        })
        .addMethods(/** @lends app.widgets.DataImage# */{
            /**
             * @param {bookworm.FieldKey} urlFieldKey
             * @ignore
             */
            init: function (urlFieldKey) {
                base.init.call(this);
                b$.EntityBound.init.call(this);
                widgets.EntityWidget.init.call(this, urlFieldKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateImageUrl();

                this
                    .bindToEntityNodeChange(this.fieldKey, 'onImageChange')
                    .bindToEntityNodeChange(this.fieldKey.documentKey, 'onDocumentReplace');
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
