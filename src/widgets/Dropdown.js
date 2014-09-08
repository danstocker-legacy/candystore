/*global dessert, troop, sntls, s$, jQuery, app */
troop.postpone(app.widgets, 'Dropdown', function (/**app.widgets*/widgets, className, /**jQuery*/$) {
    "use strict";

    var base = s$.Widget,
        self = base.extend(className)
            .addTraitAndExtend(widgets.AlignedPopup, 'Popup');

    /**
     * @name app.widgets.Dropdown.create
     * @function
     * @returns {app.widgets.Dropdown}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     * @extends app.widgets.AlignedPopup
     */
    app.widgets.Dropdown = self
        .addMethods(/** @lends app.widgets.Dropdown# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                widgets.AlignedPopup.init.call(this);

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
                widgets.AlignedPopup.afterAdd.call(this);

                this
                    .subscribeTo(widgets.OptionList.EVENT_OPTION_FOCUS, this.onOptionFocus)
                    .subscribeTo(widgets.OptionList.EVENT_OPTION_SELECT, this.onOptionSelect)
                    .subscribeTo(widgets.OptionList.EVENT_OPTIONS_ESCAPE, this.onOptionsEscape);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                widgets.AlignedPopup.afterRemove.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                widgets.AlignedPopup.afterRender.call(this);
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.children.toString();
            },

            /** @returns {app.widgets.List} */
            createListWidget: function () {
                return widgets.List.create();
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
