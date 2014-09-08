/*global dessert, troop, sntls, e$, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Input', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * Creates an Input widget instance.
     * @name candystore.Input.create
     * @function
     * @param {string} inputType Corresponds to the input tag's type argument.
     * @returns {candystore.Input}
     */

    /**
     * Base class for input elements, with validation.
     * @class
     * @extends shoeshine.Widget
     */
    candystore.Input = self
        .addConstants(/** @lends candystore.Input */{
            /** @constant */
            EVENT_INPUT_GOT_VALUE: 'input-got-value',

            /** @constant */
            EVENT_INPUT_LOST_VALUE: 'input-lost-value',

            /** @constant */
            EVENT_INPUT_FOCUS: 'input-focus',

            /** @constant */
            EVENT_INPUT_BLUR: 'input-blur',

            /** @constant */
            EVENT_INPUT_VALUE_CHANGE: 'input-value-change',

            /** @constant */
            EVENT_INPUT_VALID: 'input-valid',

            /** @constant */
            EVENT_INPUT_INVALID: 'input-invalid',

            /** @constant */
            EVENT_INPUT_SUBMIT: 'input-submit',

            /** @constant */
            inputTypes: {
                // basic input types
                button  : 'button',
                checkbox: 'checkbox',
                file    : 'file',
                hidden  : 'hidden',
                image   : 'image',
                password: 'password',
                radio   : 'radio',
                reset   : 'reset',
                submit  : 'submit',
                text    : 'text',

                // HTML 5 types
                color   : 'color',
                date    : 'date',
                datetime: 'datetime',
                'datetime-local': 'datetime-local',
                email   : 'email',
                month   : 'month',
                number  : 'number',
                range   : 'range',
                search  : 'search',
                tel     : 'tel',
                time    : 'time',
                url     : 'url',
                week    : 'week'
            }
        })
        .addPrivateMethods(/** @lends candystore.Input# */{
            /**
             * @param {string} inputValue
             * @private
             */
            _setInputValue: function (inputValue) {
                this.addAttribute('value', inputValue);
                this.inputValue = inputValue;
            },

            /** @private */
            _updateDom: function () {
                $(this.getElement()).val(this.inputValue);
            },

            /**
             * Updates the validity of the current input value, and triggers validity events accordingly.
             * @param {boolean} wasValid Validity before the last value change.
             * @returns {boolean}
             * @private
             */
            _updateInputValidity: function (wasValid) {
                // validating current value
                var validatorFunction = this.validatorFunction,
                    validationError = validatorFunction && validatorFunction(this.inputValue),
                    isValid = validationError === undefined;

                // storing last validation error on instance
                this.lastValidationError = validationError;

                // triggering validation event
                if (wasValid && !isValid) {
                    // input just became invalid
                    // TODO: revise as soon as evan supports collection payload
                    // clobbers previously set payload
                    this
                        .setNextPayload(validationError)
                        .triggerSync(this.EVENT_INPUT_INVALID)
                        .clearNextPayload();
                } else if (!wasValid && isValid) {
                    // input just became valid
                    this.triggerSync(this.EVENT_INPUT_VALID);
                }
            },

            /**
             * Triggers change event depending on the current and previous input value.
             * @param {string} oldInputValue Input value before the last change
             * @private
             */
            _triggerChangeEvent: function (oldInputValue) {
                var newInputValue = this.inputValue;

                if (oldInputValue !== newInputValue) {
                    this.triggerSync(this.EVENT_INPUT_VALUE_CHANGE, {
                        oldInputValue: oldInputValue,
                        newInputValue: newInputValue
                    });
                }
            }
        })
        .addMethods(/** @lends candystore.Input# */{
            /**
             * @param {string} inputType
             * @ignore
             */
            init: function (inputType) {
                dessert.isInputType(inputType, "Invalid input type");

                base.init.call(this);

                this.elevateMethod('onValueChange');

                /**
                 * Whether input can submit form on enter.
                 * @type {boolean}
                 */
                this.canSubmit = true;

                /**
                 * Current value of the input.
                 * @type {*}
                 */
                this.inputValue = undefined;

                /**
                 * Function that validates the input's value.
                 * Receives the input value as argument and is expected to return undefined when it's valid,
                 * any other value when it's not. Return value will be stored as instance property (lastValidationError)
                 * as well as passed to the validity event as payload.
                 * @type {function}
                 */
                this.validatorFunction = undefined;

                /**
                 * Return value of validatorFunction following the latest input value change.
                 * @type {*}
                 */
                this.lastValidationError = undefined;

                // setting html properties & attributes
                this
                    .setTagName('input')
                    .addAttribute('type', inputType);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._updateInputValidity(false);
                this.subscribeTo(this.EVENT_INPUT_VALUE_CHANGE, this.onValueChange);
            },

            /**
             * @param {boolean} canSubmit
             * @returns {candystore.Input}
             */
            setCanSubmit: function (canSubmit) {
                this.canSubmit = canSubmit;
                return this;
            },

            /**
             * Determines whether the input value is currently valid.
             * Input value is valid when the last validation error was undefined.
             * @returns {boolean}
             */
            isValid: function () {
                return this.lastValidationError === undefined;
            },

            /**
             * Sets input value and triggers corresponding events.
             * @param {string} inputValue
             * @param {boolean} [updateDom]
             * @returns {candystore.Input}
             */
            setInputValue: function (inputValue, updateDom) {
                var oldInputValue = this.inputValue;

                this._setInputValue(inputValue);

                if (updateDom) {
                    this._updateDom();
                }

                this._triggerChangeEvent(oldInputValue);

                return this;
            },

            /**
             * Sets validator function.
             * @param {function} validatorFunction
             * @returns {candystore.Input}
             * @see candystore.Input#validatorFunction
             */
            setValidatorFunction: function (validatorFunction) {
                dessert.isFunction(validatorFunction, "Invalid validatorFunction function");
                this.validatorFunction = validatorFunction;
                return this;
            },

            /** @returns {candystore.Input} */
            focusOnInput: function () {
                var element = this.getElement();
                if (element) {
                    $(element).focus();
                }
                return this;
            },

            /** @returns {candystore.Input} */
            blurInput: function () {
                var element = this.getElement();
                if (element) {
                    $(element).blur();
                }
                return this;
            },

            /**
             * Called when input value change is detected on the widget level.
             * Updates value attribute and validity, triggers further widget events.
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onValueChange: function (event) {
                var payload = event.payload,
                    oldInputValue = payload.oldInputValue,
                    newInputValue = payload.newInputValue,
                    wasValid = this.isValid();

                this._setInputValue(newInputValue);

                this.setNextOriginalEvent(event);

                this._updateInputValidity(wasValid);

                if (newInputValue && !oldInputValue) {
                    this.triggerSync(this.EVENT_INPUT_GOT_VALUE);
                } else if (!newInputValue && oldInputValue) {
                    this.triggerSync(this.EVENT_INPUT_LOST_VALUE);
                }

                this.clearNextOriginalEvent();
            }
        });
}, jQuery);

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isInputType: function (expr) {
            return candystore.Input.inputTypes[expr] === expr;
        },

        isInputTypeOptional: function (expr) {
            return expr === undefined ||
                candystore.Input.inputTypes[expr] === expr;
        }
    });
}());
