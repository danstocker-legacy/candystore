/*global dessert, troop, sntls, e$, shoeshine, candystore */
troop.postpone(candystore, 'FormField', function (ns, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * Creates a FormField widget instance.
     * @name candystore.FormField.create
     * @function
     * @param {string} [inputType] Corresponds to the input tag's type argument. Defaults to 'text'.
     * @returns {candystore.FormField}
     */

    /**
     * Represents a single field inside the form, with input and other controls on the side,
     * such as comment and warning.
     * @class
     * @extends shoeshine.Widget
     */
    candystore.FormField = self
        .addPrivateMethods(/** @lends candystore.FormField# */{
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
        .addMethods(/** @lends candystore.FormField# */{
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

                /** @type {candystore.Label} */
                this.commentLabel = candystore.Label.create()
                    .setChildName('comment');

                /** @type {candystore.Label} */
                this.warningLabel = candystore.Label.create()
                    .setChildName('warning');

                this.createInputWidget()
                    .setChildName('input')
                    .addToParent(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this
                    .subscribeTo(candystore.Input.EVENT_INPUT_BLUR, this.onInputBlur)
                    .subscribeTo(candystore.Input.EVENT_INPUT_VALID, this.onInputValid);
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
             * @returns {candystore.Input}
             */
            createInputWidget: function () {
                return candystore.Input.create(this.inputType);
            },

            /** @returns {candystore.Input} */
            getInputWidget: function () {
                return this.getChild('input');
            },

            /**
             * @param {string} warningMessage
             * @returns {candystore.FormField}
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

            /** @returns {candystore.FormField} */
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
             * @returns {candystore.FormField}
             */
            setComment: function (comment) {
                this.commentLabel
                    .setLabelText(comment)
                    .addToParent(this);
                return this;
            },

            /** @returns {candystore.FormField} */
            clearComment: function () {
                this.commentLabel
                    .removeFromParent();
                return this;
            },

            /** @returns {candystore.FormField} */
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

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isFormField: function (expr) {
            return candystore.FormField.isBaseOf(expr);
        },

        isFormFieldOptional: function (expr) {
            return expr === undefined ||
                candystore.FormField.isBaseOf(expr);
        }
    });
}());
