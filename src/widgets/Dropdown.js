/*global dessert, troop, sntls, evan, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Dropdown', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
            .addTraitAndExtend(candystore.AlignedPopup, 'Popup');

    /**
     * Creates a Dropdown instance.
     * @name candystore.Dropdown.create
     * @function
     * @returns {candystore.Dropdown}
     */

    /**
     * The Dropdown is a navigable list wrapped inside a popup.
     * The internal list can be of any List-based class, however, the Dropdown will only function properly
     * when the internal list has the OptionList trait, and its items have the Option trait.
     * The dropdown aligns to its parent widget's DOM using the settings provided via AlignedPopup.
     * By default, it will align its top left corner to the parent's bottom left corner.
     * The Dropdown controls scrolling of the internal list.
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

                this.spawnListWidget()
                    .setChildName('options-list')
                    .addToParent(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                candystore.AlignedPopup.afterAdd.call(this);

                this
                    .subscribeTo(candystore.Option.EVENT_OPTION_FOCUS, this.onOptionFocus)
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
             * Creates the internal list widget.
             * Override this method to specify other List-based widgets to use.
             * Ones that have the OptionList trait, and its items have the Option trait, are the best.
             * @returns {candystore.List}
             */
            spawnListWidget: function () {
                return candystore.List.create();
            },

            /**
             * Retrieves the internal List instance.
             * @returns {candystore.List}
             */
            getListWidget: function () {
                return this.getChild('options-list');
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onOptionFocus: function (event) {
                var element = this.getElement();

                if (!element) {
                    return;
                }

                var $element = $(element),
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
             * TODO: Use evan events as soon as .getOriginalEventByName is available in evan.
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onOptionSelect: function (event) {
                var originalEvent = event.getOriginalEventByType(jQuery.Event);
                if (originalEvent && (
                    originalEvent.type === 'click' ||
                    originalEvent.type === 'keydown' && originalEvent.which === 13
                    )) {
                    // only when select was initiated by user interaction (click on Option)
                    evan.eventSpaceRegistry.pushOriginalEvent(event);
                    this.closePopup();
                    evan.eventSpaceRegistry.popOriginalEvent();
                }
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onOptionsEscape: function (event) {
                evan.eventSpaceRegistry.pushOriginalEvent(event);
                this.closePopup();
                evan.eventSpaceRegistry.popOriginalEvent();
            }
        });
}, jQuery);
