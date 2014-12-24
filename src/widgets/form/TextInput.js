/*global dessert, troop, sntls, evan, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'TextInput', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = candystore.Input,
        self = base.extend(className)
            .addTrait(shoeshine.JqueryWidget);

    /**
     * Creates a TextInput instance.
     * PasswordInput instance may also be created by instantiating `candystore.Input` with the type 'text'.
     * @name candystore.TextInput.create
     * @function
     * @param {string} [textInputType]
     * @returns {candystore.TextInput}
     */

    /**
     * The TextInput extends the Input for text input specifically.
     * Implements mostly UI event handlers, and channels them into widget events.
     * Also delegates surrogate to Input: instantiating an Input with 'type'='text' will yield a TextInput instance.
     * @class
     * @extends candystore.Input
     * @extends shoeshine.JqueryWidget
     */
    candystore.TextInput = self
        .addConstants(/** @lends candystore.Input */{
            /**
             * @type {object}
             * @constant
             */
            inputTagNames: {
                'input'   : 'input',
                'textarea': 'textarea'
            },

            /**
             * @type {object}
             * @constant
             */
            inputTypes: {
                // basic input types
                password: 'password',
                text    : 'text',

                // HTML 5 types
                email   : 'email',
                search  : 'search',
                tel     : 'tel',
                url     : 'url'
            }
        })
        .addPrivateMethods(/** @lends candystore.TextInput# */{
            /** @private */
            _startChangePolling: function () {
                var that = this;
                this.changePollTimer = setInterval(function () {
                    var element = that.getElement();
                    if (element) {
                        that.setInputValue($(element).val(), false);
                    }
                }, 1000);
            },

            /** @private */
            _stopChangePolling: function () {
                var changePollTimer = this.changePollTimer;
                if (changePollTimer) {
                    clearInterval(changePollTimer);
                    this.changePollTimer = undefined;
                }
            }
        })
        .addMethods(/** @lends candystore.TextInput# */{
            /**
             * @param {string} textInputType
             * @ignore
             */
            init: function (textInputType) {
                dessert.isTextInputTypeOptional(textInputType, "Invalid text input type");

                base.init.call(this, textInputType || 'text');

                this
                    .elevateMethod('onFocusIn')
                    .elevateMethod('onFocusOut')
                    .setCanSubmit(textInputType !== 'textarea');

                /**
                 * Timer for polling for input changes.
                 * @type {number}
                 */
                this.changePollTimer = undefined;

                // setting default input value to empty string
                this.inputValue = '';
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);

                if (candystore.pollInputValues) {
                    this._stopChangePolling();
                }
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                // TODO: use JqueryWidget based subscription when it's fixed
                var element = this.getElement();

                if (element) {
                    $(element)
                        .on('focusin', this.onFocusIn)
                        .on('focusout', this.onFocusOut);
                }

                if (candystore.pollInputValues) {
                    this._stopChangePolling();
                    this._startChangePolling();
                }
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onKeyDown: function (event) {
                switch (event.which) {
                case 13:
                    if (this.canSubmit) {
                        // signaling that the input is attempting to submit the form
                        this
                            .setNextOriginalEvent(event)
                            .triggerSync(this.EVENT_INPUT_SUBMIT)
                            .clearNextOriginalEvent();
                    }
                    break;

                case 9:
                    this
                        .setNextOriginalEvent(event)
                        .triggerSync(this.EVENT_INPUT_TAB)
                        .clearNextOriginalEvent();
                    break;
                }
            },

            /**
             * Triggered on onkeyup, oninput, and onchange.
             * However, does not trigger Input event unless the value actually changed.
             * @param {jQuery.Event} event
             * @ignore
             */
            onChange: function (event) {
                var element = this.getElement(),
                    newInputValue;

                if (element) {
                    newInputValue = $(element).val();

                    this
                        .setNextOriginalEvent(event)
                        .setInputValue(newInputValue)
                        .clearNextOriginalEvent();
                }
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onFocusIn: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .triggerSync(this.EVENT_INPUT_FOCUS)
                    .clearNextOriginalEvent();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onFocusOut: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .triggerSync(this.EVENT_INPUT_BLUR)
                    .clearNextOriginalEvent();
            }
        });

    self
        .on('keydown', '', 'onKeyDown')
        .on('keyup input change', '', 'onChange');
}, jQuery);

troop.amendPostponed(candystore, 'Input', function () {
    "use strict";

    candystore.Input
        .addSurrogate(candystore, 'TextInput', function (inputType) {
            var TextInput = candystore.TextInput;
            return TextInput.inputTagNames[inputType] === inputType ||
                   TextInput.inputTypes[inputType] === inputType;
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        /** @param {string} expr */
        isTextInputType: function (expr) {
            var TextInput = candystore.TextInput;
            return expr &&
                   (TextInput.inputTagNames[expr] === expr ||
                    TextInput.inputTypes[expr] === expr);
        },

        /** @param {string} expr */
        isTextInputTypeOptional: function (expr) {
            var TextInput = candystore.TextInput;
            return TextInput.inputTypes[expr] === expr ||
                   TextInput.inputTagNames[expr] === expr;
        }
    });
}());
