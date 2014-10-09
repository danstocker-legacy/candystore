/*global dessert, troop, sntls, evan, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Input', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * Creates an Input instance.
     * @name candystore.Input.create
     * @function
     * @param {string} inputType Corresponds to the input tag's type argument.
     * @returns {candystore.Input}
     */

    /**
     * The Input is the base class for all input widgets: text, checkbox, radio button, etc.
     * Inputs can be validated by supplying a validator function.
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
            EVENT_INPUT_TAB: 'input-tab',

            /** @constant */
            EVENT_INPUT_VALUE_CHANGE: 'input-value-change',

            /** @constant */
            EVENT_INPUT_VALID: 'input-valid',

            /** @constant */
            EVENT_INPUT_INVALID: 'input-invalid',

            /** @constant */
            EVENT_INPUT_ERROR_CHANGE: 'input-error-change',

            /** @constant */
            EVENT_INPUT_SUBMIT: 'input-submit',

            /**
             * @type {object}
             * @constant
             */
            inputTagNames: {
                'input'   : 'input',
                'textarea': 'textarea',
                'select'  : 'select'
            },

            /**
             * @type {object}
             * @constant
             */
            inputTypes: {
                // basic input types
                'button'        : 'button',
                'checkbox'      : 'checkbox',
                'file'          : 'file',
                'hidden'        : 'hidden',
                'image'         : 'image',
                'password'      : 'password',
                'radio'         : 'radio',
                'reset'         : 'reset',
                'submit'        : 'submit',
                'text'          : 'text',

                // HTML 5 types
                'color'         : 'color',
                'date'          : 'date',
                'datetime'      : 'datetime',
                'datetime-local': 'datetime-local',
                'email'         : 'email',
                'month'         : 'month',
                'number'        : 'number',
                'range'         : 'range',
                'search'        : 'search',
                'tel'           : 'tel',
                'time'          : 'time',
                'url'           : 'url',
                'week'          : 'week'
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
                this.lastValidationError = true;

                if (this.inputTagNames[inputType] === inputType) {
                    // setting tag name for input
                    this.setTagName(inputType);
                } else if (this.inputTypes[inputType] === inputType) {
                    // setting input attribute
                    this.setTagName('input')
                        .addAttribute('type', inputType);
                }
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this.validateInputValue();
                this.subscribeTo(this.EVENT_INPUT_VALUE_CHANGE, this.onValueChange);
            },

            /**
             * Sets whether the input can signal to submit the form (if it is in a form).
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
             * Sets validator function. The validator function will be passed the current input value
             * and is expected to return a validation error (code or message) or undefined.
             * @param {function} validatorFunction
             * @returns {candystore.Input}
             * @see candystore.Input#validatorFunction
             */
            setValidatorFunction: function (validatorFunction) {
                dessert.isFunction(validatorFunction, "Invalid validatorFunction function");
                this.validatorFunction = validatorFunction;
                return this;
            },

            /**
             * Updates the validity of the current input value, and triggers validity events accordingly.
             * TODO: Manage validity separately from validationError. Validity should start out as undefined
             * and could take values true or false.
             * @returns {candystore.Input}
             */
            validateInputValue: function () {
                // validating current value
                var validatorFunction = this.validatorFunction,
                    oldValidationError = this.lastValidationError,
                    newValidationError = validatorFunction && validatorFunction(this.inputValue),
                    wasValid = this.isValid(),
                    isValid = newValidationError === undefined;

                // storing last validation error on instance
                this.lastValidationError = newValidationError;

                // triggering validation event
                if (wasValid && !isValid) {
                    // input just became invalid
                    // TODO: revise as soon as evan supports collection payload
                    // clobbers previously set payload
                    this
                        .setNextPayload(newValidationError)
                        .triggerSync(this.EVENT_INPUT_INVALID)
                        .clearNextPayload();
                } else if (!wasValid && isValid) {
                    // input just became valid
                    this.triggerSync(this.EVENT_INPUT_VALID);
                } else if (newValidationError !== oldValidationError) {
                    // triggering event about error change
                    this.triggerSync(this.EVENT_INPUT_ERROR_CHANGE, {
                        oldValidationError: oldValidationError,
                        newValidationError: newValidationError
                    });
                }

                return this;
            },

            /**
             * Focuses on the current input.
             * @returns {candystore.Input}
             */
            focusOnInput: function () {
                var element = this.getElement();
                if (element) {
                    $(element).focus();
                }
                return this;
            },

            /**
             * Removes focus from the current input.
             * @returns {candystore.Input}
             */
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
                    newInputValue = payload.newInputValue;

                this._setInputValue(newInputValue);

                this
                    .setNextOriginalEvent(event)
                    .validateInputValue();

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
        /** @param {string} expr */
        isInputType: function (expr) {
            return expr &&
                   (candystore.Input.inputTagNames[expr] === expr ||
                    candystore.Input.inputTypes[expr] === expr);
        },

        /** @param {string} expr */
        isInputTypeOptional: function (expr) {
            return candystore.Input.inputTagNames[expr] === expr ||
                   candystore.Input.inputTypes[expr] === expr;
        }
    });
}());
