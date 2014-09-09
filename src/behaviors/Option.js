/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Option', function (ns, className) {
    "use strict";

    var base = troop.Base,
        self = base.extend(className);

    /**
     * Dropdown list item (option) trait.
     * Add this trait to classes aimed to be used as options in a dropdown list.
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

                /** @type {*} */
                this.optionValue = optionValue;
            },

            /**
             * Call from host's afterRender.
             */
            afterRender: function () {
                $(this.getElement())
                    .on('click', this._onOptionClick)
                    .on('mouseenter', this._onOptionHover)
            },

            /**
             * @param {*} optionValue
             * @returns {candystore.Option}
             */
            setOptionValue: function (optionValue) {
                this.optionValue = optionValue;
                return this;
            }
        });
});
