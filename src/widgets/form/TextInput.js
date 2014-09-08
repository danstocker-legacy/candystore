/*global dessert, troop, sntls, e$, s$, jQuery, app */
troop.postpone(app.widgets, 'TextInput', function (/**app.widgets*/widgets, className, /**jQuery*/$) {
    "use strict";

    var base = widgets.Input,
        self = base.extend(className)
            .addTrait(s$.JqueryWidget);

    /**
     * @name app.widgets.TextInput.create
     * @function
     * @param {string} [textInputType]
     * @returns {app.widgets.TextInput}
     */

    /**
     * @class
     * @extends app.widgets.Input
     * @extends shoeshine.JqueryWidget
     */
    app.widgets.TextInput = self
        .addConstants(/** @lends app.widgets.Input */{
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
        .addMethods(/** @lends app.widgets.TextInput# */{
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

troop.amendPostponed(app.widgets, 'Input', function (/**app.widgets*/widgets) {
    "use strict";

    widgets.Input
        .addSurrogate(widgets, 'TextInput', function (inputType) {
            return inputType === 'text';
        });
});

(function (/**app.widgets*/widgets) {
    "use strict";

    dessert.addTypes(/** @lends dessert */{
        isTextInputType: function (expr) {
            return widgets.TextInput.inputTypes[expr] === expr;
        },

        isTextInputTypeOptional: function (expr) {
            return expr === undefined ||
                widgets.TextInput.inputTypes[expr] === expr;
        }
    });
}(app.widgets));
