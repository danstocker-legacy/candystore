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
                    .elevateMethod('onFocusOut');
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);

                // TODO: use JqueryWidget based subscription when it's fixed
                var $element = $(this.getElement());
                $element
                    .on('focusin', this.onFocusIn)
                    .on('focusout', this.onFocusOut);
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
             * @param {jQuery.Event} event
             * @ignore
             */
            onKeyUp: function (event) {
                var $element = $(this.getElement()),
                    newInputValue = $element.val();

                this
                    .setNextOriginalEvent(event)
                    .setInputValue(newInputValue)
                    .clearNextOriginalEvent();
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
        // onkeyup is safer in older browsers than oninput
        .on('keyup', '', 'onKeyUp');
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
