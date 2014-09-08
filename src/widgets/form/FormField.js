/*global dessert, troop, sntls, e$, s$, app */
troop.postpone(app.widgets, 'FormField', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = s$.Widget,
        self = base.extend(className);

    /**
     * Creates a FormField widget instance.
     * @name app.widgets.FormField.create
     * @function
     * @param {string} [inputType] Corresponds to the input tag's type argument. Defaults to 'text'.
     * @returns {app.widgets.FormField}
     */

    /**
     * Represents a single field inside the form, with input and other controls on the side,
     * such as comment and warning.
     * @class
     * @extends shoeshine.Widget
     */
    app.widgets.FormField = self
        .addPrivateMethods(/** @lends app.widgets.FormField# */{
            /** @private */
            _updateStyle: function () {
                var inputWidget = this.getInputWidget();
                if (inputWidget.isValid()) {
                    this.clearWarningMessage();
                } else {
                    this.setWarningMessage(inputWidget.lastValidationError);
                }
            }
        })
        .addMethods(/** @lends app.widgets.FormField# */{
            /**
             * @param {string} [inputType]
             * @ignore
             */
            init: function (inputType) {
                dessert.isInputTypeOptional(inputType, "Invalid input type");

                base.init.call(this);

                this
                    .elevateMethod('onInputBlur')
                    .elevateMethod('onInputValid');

                /** @type {string} */
                this.inputType = inputType || 'text';

                /** @type {app.widgets.Label} */
                this.commentLabel = widgets.Label.create()
                    .setChildName('comment');

                /** @type {app.widgets.Label} */
                this.warningLabel = widgets.Label.create()
                    .setChildName('warning');

                this.createInputWidget()
                    .setChildName('input')
                    .addToParent(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this
                    .subscribeTo(widgets.Input.EVENT_INPUT_BLUR, this.onInputBlur)
                    .subscribeTo(widgets.Input.EVENT_INPUT_VALID, this.onInputValid);
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.children.toString();
            },

            /**
             * Override to specify input widget included in the form field.
             * @returns {app.widgets.Input}
             */
            createInputWidget: function () {
                return widgets.Input.create(this.inputType);
            },

            /** @returns {app.widgets.Input} */
            getInputWidget: function () {
                return this.getChild('input');
            },

            /**
             * @param {string} warningMessage
             * @returns {app.widgets.FormField}
             */
            setWarningMessage: function (warningMessage) {
                this.warningLabel
                    .setLabelText(warningMessage)
                    .addToParent(this);

                this
                    .removeCssClass('field-valid')
                    .addCssClass('field-invalid');

                return this;
            },

            /** @returns {app.widgets.FormField} */
            clearWarningMessage: function () {
                this.warningLabel
                    .removeFromParent();

                this
                    .removeCssClass('field-invalid')
                    .addCssClass('field-valid');

                return this;
            },

            /**
             * @param {string} comment
             * @returns {app.widgets.FormField}
             */
            setComment: function (comment) {
                this.commentLabel
                    .setLabelText(comment)
                    .addToParent(this);
                return this;
            },

            /** @returns {app.widgets.FormField} */
            clearComment: function () {
                this.commentLabel
                    .removeFromParent();
                return this;
            },

            /** @returns {app.widgets.FormField} */
            focusOnField: function () {
                this.getInputWidget()
                    .focusOnInput();
                return this;
            },

            /** @ignore */
            onInputBlur: function () {
                this._updateStyle();
            },

            /** @ignore */
            onInputValid: function () {
                this._updateStyle();
            }
        });
});

(function (/**app.widgets*/widgets) {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isFormField: function (expr) {
            return widgets.FormField.isBaseOf(expr);
        },

        isFormFieldOptional: function (expr) {
            return expr === undefined ||
                widgets.FormField.isBaseOf(expr);
        }
    });
}(app.widgets));
