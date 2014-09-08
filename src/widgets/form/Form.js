/*global dessert, troop, sntls, e$, s$, jQuery, app */
troop.postpone(app.widgets, 'Form', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = s$.Widget,
        self = base.extend(className)
            .addTrait(s$.JqueryWidget);

    /**
     * Creates a Form widget instance.
     * @name app.widgets.Form.create
     * @function
     * @returns {app.widgets.Form}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     * @extends shoeshine.JqueryWidget
     */
    app.widgets.Form = self
        .addConstants(/** @lends app.widgets.Form */{
            /** @constant */
            EVENT_FORM_VALID: 'form-valid',

            /** @constant */
            EVENT_FORM_INVALID: 'form-invalid',

            /** @constant */
            EVENT_FORM_SUBMIT: 'form-submit'
        })
        .addPrivateMethods(/** @lends app.widgets.Form# */{
            /** @private */
            _updateCounters: function () {
                var formFields = this.getFormFields(),
                    validFieldNames = formFields
                        .callOnEachItem('getInputWidget')
                        .callOnEachItem('isValid')
                        .toStringDictionary()
                        .reverse()
                        .getItem('true');

                this.fieldCount = formFields.getKeyCount();
                this.validFieldCount = validFieldNames ?
                    validFieldNames.length :
                    0;
            },

            /**
             * @param {boolean} wasValid
             * @private
             */
            _triggerValidityEvent: function (wasValid) {
                var isValid = this.isValid();

                if (isValid && !wasValid) {
                    this.triggerSync(this.EVENT_FORM_INVALID);
                } else if (!isValid && wasValid) {
                    this.triggerSync(this.EVENT_FORM_VALID);
                }
            },

            /** @private */
            _triggerSubmissionEvent: function () {
                if (this.validFieldCount === this.fieldCount) {
                    this.triggerSync(this.EVENT_FORM_SUBMIT);
                }
            }
        })
        .addMethods(/** @lends app.widgets.Form# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('form');

                this
                    .elevateMethod('onInputSubmit')
                    .elevateMethod('onInputValid')
                    .elevateMethod('onInputInvalid');

                /** @type {number} */
                this.fieldCount = undefined;

                /** @type {number} */
                this.validFieldCount = undefined;
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateCounters();

                this
                    .subscribeTo(widgets.Input.EVENT_INPUT_SUBMIT, this.onInputSubmit)
                    .subscribeTo(widgets.Input.EVENT_INPUT_VALID, this.onInputValid)
                    .subscribeTo(widgets.Input.EVENT_INPUT_INVALID, this.onInputInvalid);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                this.focusOnFirstField();
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return [
                    //@formatter:off
                    '<ul class="inputs-container">',
                        this.children,
                    '</ul>'
                    //@formatter:on
                ].join('');
            },

            /** @returns {boolean} */
            isValid: function () {
                return this.validFieldCount === this.fieldCount;
            },

            /**
             * @param {app.widgets.FormField} formField
             * @returns {app.widgets.Form}
             */
            addFormField: function (formField) {
                dessert
                    .isFormField(formField, "Invalid form field")
                    .assert(!this.getChild(formField.childName), "Specified field already exists");

                formField
                    .setTagName('li')
                    .setContainerCssClass('inputs-container')
                    .addToParent(this);

                this.fieldCount++;

                if (formField.getInputWidget().isValid()) {
                    this.validFieldCount++;
                }

                return this;
            },

            /**
             * TODO: make sure returned value is either FormField instance or undefined
             * @param {string} fieldName
             * @returns {app.widgets.FormField}
             */
            getFormField: function (fieldName) {
                return this.getChild(fieldName);
            },

            /** @returns {shoeshine.WidgetCollection} */
            getFormFields: function () {
                return this.children.filterByType(widgets.FormField);
            },

            /**
             * Attempts to submit form.
             * @returns {app.widgets.Form}
             */
            trySubmittingForm: function () {
                this._triggerSubmissionEvent();
                return this;
            },

            /**
             * Puts focus on first field of the form.
             * @returns {app.widgets.Form}
             */
            focusOnFirstField: function () {
                var firstField = this.children
                    .filterByType(widgets.FormField)
                    .getSortedValues()[0];

                if (firstField) {
                    firstField.focusOnField();
                }

                return this;
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onInputSubmit: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .trySubmittingForm()
                    .clearNextOriginalEvent();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onInputValid: function (event) {
                var wasValid = this.isValid();

                this.validFieldCount++;
                this.setNextOriginalEvent(event);
                this._triggerValidityEvent(wasValid);
                this.clearNextOriginalEvent();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onInputInvalid: function (event) {
                var wasValid = this.isValid();

                this.validFieldCount--;
                this.setNextOriginalEvent(event);
                this._triggerValidityEvent(wasValid);
                this.clearNextOriginalEvent();
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onSubmit: function (event) {
                // suppressing native form submission
                event.preventDefault();
            }
        });

    self.on('submit', '', 'onSubmit');
});

(function (/**app.widgets*/widgets) {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isForm: function (expr) {
            return widgets.Form.isBaseOf(expr);
        },

        isFormOptional: function (expr) {
            return expr === undefined ||
                   widgets.Form.isBaseOf(expr);
        }
    });
}(app.widgets));
