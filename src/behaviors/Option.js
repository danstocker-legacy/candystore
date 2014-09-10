/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Option', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend(className);

    /**
     * The Option trait allows widgets to behave like option items in a dropdown or select list.
     * Add this trait to classes aimed to be used as options in a dropdown.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     */
    candystore.Option = self
        .addConstants(/** @lends candystore.Option# */{
            /** @constant */
            EVENT_OPTION_CLICK: 'option-click',

            /** @constant */
            EVENT_OPTION_HOVER: 'option-hover'
        })
        .addPrivateMethods(/** @lends candystore.Option# */{
            /**
             * @param {jQuery.Event} event
             * @private
             * @ignore
             */
            _onOptionClick: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .triggerSync(this.EVENT_OPTION_CLICK)
                    .clearNextOriginalEvent();
            },

            /**
             * @param {jQuery.Event} event
             * @private
             * @ignore
             */
            _onOptionHover: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .triggerSync(this.EVENT_OPTION_HOVER)
                    .clearNextOriginalEvent();
            }
        })
        .addMethods(/** @lends candystore.Option# */{
            /**
             * Call from host's init.
             * @param {*} [optionValue]
             */
            init: function (optionValue) {
                this
                    .elevateMethod('_onOptionClick')
                    .elevateMethod('_onOptionHover');

                /**
                 * Value carried by option.
                 * This is not what's displayed in the option, but the logical value associated with it.
                 * This is the value that will be passed back along the event when the option is selected.
                 * @type {*}
                 */
                this.optionValue = optionValue;
            },

            /** Call from host's afterRender. */
            afterRender: function () {
                $(this.getElement())
                    .on('click', this._onOptionClick)
                    .on('mouseenter', this._onOptionHover);
            },

            /**
             * Sets option value.
             * @param {*} optionValue
             * @returns {candystore.Option}
             */
            setOptionValue: function (optionValue) {
                this.optionValue = optionValue;
                return this;
            }
        });
}, jQuery);
