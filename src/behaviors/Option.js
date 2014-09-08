/*global dessert, troop, sntls, s$, jQuery, app */
troop.postpone(app.widgets, 'Option', function (/**app.widgets*/widgets, className) {
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
    app.widgets.Option = self
        .addConstants(/** @lends app.widgets.Option# */{
            /** @constant */
            EVENT_OPTION_CLICK: 'option-click',

            /** @constant */
            EVENT_OPTION_HOVER: 'option-hover'
        })
        .addPrivateMethods(/** @lends app.widgets.Option# */{
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
        .addMethods(/** @lends app.widgets.Option# */{
            /**
             * Call from host's init.
             * @param {*} [optionValue]
             */
            init: function (optionValue) {
                /** @type {*} */
                this.optionValue = optionValue;
            },

            /**
             * @param {*} optionValue
             * @returns {app.widgets.Option}
             */
            setOptionValue: function (optionValue) {
                this.optionValue = optionValue;
                return this;
            }
        });

    s$.JqueryWidget
        .on('click', '.Option', '_onOptionClick')
        .on('mouseenter', '.Option', '_onOptionHover');
});
