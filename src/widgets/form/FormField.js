/*global dessert, troop, sntls, evan, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'FormField', function (ns, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * Creates a FormField instance.
     * @name candystore.FormField.create
     * @function
     * @param {string} [inputType] Corresponds to the input tag's type argument. Defaults to 'text'.
     * @returns {candystore.FormField}
     */

    /**
     * Represents a single field inside the form, with input and other accompanying controls,
     * such as comment and warning.
     * Supports enabling/disabling TAB keys.
     * TODO: add create... methods for comment and warning, too
     * @class
     * @extends shoeshine.Widget
     */
    candystore.FormField = self
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
                    .elevateMethod('onInputTab')
                    .elevateMethod('onInputValid')
                    .elevateMethod('onFormReset');

                /**
                 * Whether the field allows to move to the next tab index.
                 * @type {boolean}
                 */
                this.allowsTabForwards = true;

                /**
                 * Whether the field allows to move to the previous tab index.
                 * @type {boolean}
                 */
                this.allowsTabBackwards = true;

                /**
                 * Type attribute of the input field.
                 * @type {string}
                 */
                this.inputType = inputType || 'text';

                /**
                 * Widget that optionally displays a comment associated with the input field.
                 * @type {candystore.Label}
                 */
                this.commentLabel = candystore.Label.create()
                    .setChildName('field-comment');

                /**
                 * Widget that displays a warning message whenever input validation fails.
                 * @type {candystore.Label}
                 */
                this.warningLabel = candystore.Label.create()
                    .setChildName('field-warning');

                this.spawnInputWidget()
                    .setChildName('field-input')
                    .addToParent(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this
                    .subscribeTo(candystore.Input.EVENT_INPUT_BLUR, this.onInputBlur)
                    .subscribeTo(candystore.Input.EVENT_INPUT_TAB, this.onInputTab)
                    .subscribeTo(candystore.Input.EVENT_INPUT_VALID, this.onInputValid)
                    .subscribeTo(candystore.Form.EVENT_FORM_RESET, this.onFormReset);
            },

            /**
             * Creates input widget.
             * Override to specify custom input field.
             * With the input type-based surrogates in place, overriding this method is rarely needed.
             * @returns {candystore.Input}
             */
            spawnInputWidget: function () {
                return candystore.Input.create(this.inputType);
            },

            /**
             * Fetches input widget.
             * @returns {candystore.Input}
             */
            getInputWidget: function () {
                return this.getChild('field-input');
            },

            /**
             * Fetches current input value on input widget.
             * @returns {*}
             */
            getInputValue: function () {
                return this.getInputWidget().inputValue;
            },

            /**
             * Sets value on input widget.
             * @param {*} inputValue
             * @param {boolean} [updateDom]
             * @returns {candystore.FormField}
             */
            setInputValue: function (inputValue, updateDom) {
                this.getInputWidget()
                    .setInputValue(inputValue, updateDom);
                return this;
            },

            /**
             * Clears value on input widget.
             * @param {boolean} [updateDom]
             * @returns {candystore.FormField}
             */
            clearInputValue: function (updateDom) {
                this.getInputWidget()
                    .clearInputValue(updateDom);
                return this;
            },

            /**
             * Allows TAB to take effect on the input.
             * @returns {candystore.FormField}
             */
            allowTabForwards: function () {
                this.allowsTabForwards = true;
                return this;
            },

            /**
             * Prevents TAB to take effect on the input.
             * @returns {candystore.FormField}
             */
            preventTabForwards: function () {
                this.allowsTabForwards = false;
                return this;
            },

            /**
             * Allows Shift+TAB to take effect on the input.
             * @returns {candystore.FormField}
             */
            allowTabBackwards: function () {
                this.allowsTabBackwards = true;
                return this;
            },

            /**
             * Prevents Shift+TAB to take effect on the input.
             * @returns {candystore.FormField}
             */
            preventTabBackwards: function () {
                this.allowsTabBackwards = false;
                return this;
            },

            /**
             * Sets warning message and sets the field to invalid state.
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

            /**
             * Clears warning message and restores valid state of the field.
             * @returns {candystore.FormField}
             */
            clearWarningMessage: function () {
                this.warningLabel
                    .removeFromParent();

                this
                    .removeCssClass('field-invalid')
                    .addCssClass('field-valid');

                return this;
            },

            /**
             * Sets comment string.
             * @param {string} comment
             * @returns {candystore.FormField}
             */
            setComment: function (comment) {
                this.commentLabel
                    .setLabelText(comment)
                    .addToParent(this);
                return this;
            },

            /**
             * Clears comment string.
             * @returns {candystore.FormField}
             */
            clearComment: function () {
                this.commentLabel
                    .removeFromParent();
                return this;
            },

            /**
             * Sets focus on the current field. (More precisely, on the current field's input widget.)
             * @returns {candystore.FormField}
             */
            focusOnField: function () {
                this.getInputWidget()
                    .focusOnInput();
                return this;
            },

            /**
             * Updates warning message to the last warning if there was one, clears it otherwise.
             * @returns {candystore.FormField}
             */
            updateWarningMessage: function () {
                var inputWidget = this.getInputWidget();

                if (inputWidget.isValid()) {
                    this.clearWarningMessage();
                } else {
                    this.setWarningMessage(inputWidget.lastValidationError);
                }

                return this;
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onInputBlur: function (event) {
                var link = evan.pushOriginalEvent(event);
                this.updateWarningMessage();
                link.unLink();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onInputTab: function (event) {
                var originalEvent = event.getOriginalEventByType(jQuery.Event);
                if (!originalEvent.shiftKey && !this.allowsTabForwards ||
                    originalEvent.shiftKey && !this.allowsTabBackwards
                    ) {
                    originalEvent.preventDefault();
                }
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onInputValid: function (event) {
                var link = evan.pushOriginalEvent(event);
                this.updateWarningMessage();
                link.unLink();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onFormReset: function (event) {
                var link = evan.pushOriginalEvent(event);
                this.clearWarningMessage();
                link.unLink();
            }
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {candystore.FormField} expr */
        isFormField: function (expr) {
            return candystore.FormField.isBaseOf(expr);
        },

        /** @param {candystore.FormField} [expr] */
        isFormFieldOptional: function (expr) {
            return expr === undefined ||
                   candystore.FormField.isBaseOf(expr);
        }
    });
}());
