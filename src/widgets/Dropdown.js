/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Dropdown', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
            .addTraitAndExtend(candystore.AlignedPopup, 'Popup');

    /**
     * @name candystore.Dropdown.create
     * @function
     * @returns {candystore.Dropdown}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     * @extends candystore.AlignedPopup
     */
    candystore.Dropdown = self
        .addMethods(/** @lends candystore.Dropdown# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                candystore.AlignedPopup.init.call(this);

                this
                    .elevateMethod('onOptionFocus')
                    .elevateMethod('onOptionSelect')
                    .elevateMethod('onOptionsEscape');

                this.createListWidget()
                    .setChildName('options-list')
                    .addToParent(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                candystore.AlignedPopup.afterAdd.call(this);

                this
                    .subscribeTo(candystore.OptionList.EVENT_OPTION_FOCUS, this.onOptionFocus)
                    .subscribeTo(candystore.OptionList.EVENT_OPTION_SELECT, this.onOptionSelect)
                    .subscribeTo(candystore.OptionList.EVENT_OPTIONS_ESCAPE, this.onOptionsEscape);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                candystore.AlignedPopup.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                candystore.AlignedPopup.afterRender.call(this);
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.children.toString();
            },

            /** @returns {candystore.List} */
            createListWidget: function () {
                return candystore.List.create();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onOptionFocus: function (event) {
                var $element = $(this.getElement()),
                    dropdownHeight = $element.outerHeight(),
                    optionList = this.getChild('options-list'),
                    optionListTop = $element.scrollTop(),
                    $option = $(optionList.getChild(event.payload.optionName).getElement()),
                    optionHeight = $option.outerHeight(),
                    optionTop = $option.position().top,

                // whether option in focus overlaps with or touches the top of the dropdown
                    isTooHigh = optionTop < optionListTop,

                // whether option in focus overlaps with or touches the bottom of the dropdown
                    isTooLow = optionTop + optionHeight > optionListTop + dropdownHeight;

                if (isTooHigh) {
                    // positioning to top of dropdown
                    $element.scrollTop(optionTop);
                } else if (isTooLow) {
                    // positioning to bottom of dropdown
                    $element.scrollTop(optionTop + optionHeight - dropdownHeight);
                }
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onOptionSelect: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .closePopup()
                    .clearNextOriginalEvent();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onOptionsEscape: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .closePopup()
                    .clearNextOriginalEvent();
            }
        });
}, jQuery);
