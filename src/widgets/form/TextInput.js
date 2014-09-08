/*global dessert, troop, sntls, e$, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'TextInput', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = candystore.Input,
        self = base.extend(className)
            .addTrait(shoeshine.JqueryWidget);

    /**
     * @name candystore.TextInput.create
     * @function
     * @param {string} [textInputType]
     * @returns {candystore.TextInput}
     */

    /**
     * @class
     * @extends candystore.Input
     * @extends shoeshine.JqueryWidget
     */
    candystore.TextInput = self
        .addConstants(/** @lends candystore.Input */{
            /** @constant */
            inputTypes: {
                // basic input types
                password: 'password',
                text  : 'text',

                // HTML 5 types
                email : 'email',
                search: 'search',
                tel   : 'tel',
                url   : 'url'
            }
        })
        .addMethods(/** @lends candystore.TextInput# */{
            /**
             * @param {string} textInputType
             * @ignore
             */
            init: function (textInputType) {
                dessert.isTextInputType(textInputType, "Invalid text input type");

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
            onKeyPress: function (event) {
                var $element = $(this.getElement()),
                    newInputValue = $element.val();

                this.setNextOriginalEvent(event);

                switch (event.which) {
                case 13:
                    if (this.canSubmit) {
                        // signaling that the input is attempting to submit the form
                        this.triggerSync(this.EVENT_INPUT_SUBMIT);
                    }
                    break;

                default:
                    // setting new value
                    this.setInputValue(newInputValue);
                    break;
                }

                this.clearNextOriginalEvent();
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

    self.on('keypress', '', 'onKeyPress');
}, jQuery);

troop.amendPostponed(candystore, 'Input', function (/**candystore*/widgets) {
    "use strict";

    widgets.Input
        .addSurrogate(widgets, 'TextInput', function (inputType) {
            return inputType === 'text';
        });
});

(function () {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isTextInputType: function (expr) {
            return candystore.TextInput.inputTypes[expr] === expr;
        },

        isTextInputTypeOptional: function (expr) {
            return expr === undefined ||
                candystore.TextInput.inputTypes[expr] === expr;
        }
    });
}());
