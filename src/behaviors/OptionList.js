/*global dessert, troop, sntls, evan, shoeshine, candystore */
troop.postpone(candystore, 'OptionList', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The OptionList trait modifies List classes so that they can be used in dropdowns.
     * Should only accept widgets as list items that implement the Option trait.
     * @class
     * @extends troop.Base
     * @extends candystore.List
     */
    candystore.OptionList = self
        .addConstants(/** @lends candystore.OptionList */{
            /** @constant */
            EVENT_OPTION_SELECT: 'option-select',

            /** @constant */
            EVENT_OPTIONS_ESCAPE: 'options-escape'
        })
        .addPrivateMethods(/** @lends candystore.OptionList# */{
            /**
             * @param {string} optionName
             * @param {*} optionValue
             * @private
             */
            _triggerSelectEvent: function (optionName, optionValue) {
                this.triggerSync(this.EVENT_OPTION_SELECT, {
                    optionName: optionName,
                    optionValue: optionValue
                });
            },

            /**
             * @param {string} newFocusedOptionName
             * @private
             */
            _setFocusedOptionName: function (newFocusedOptionName) {
                var oldFocusedOptionName = this.focusedOptionName,
                    oldFocusedOption;
                if (oldFocusedOptionName !== newFocusedOptionName) {
                    oldFocusedOption = this.getChild(oldFocusedOptionName);
                    if (oldFocusedOption) {
                        // old focused option might not be a child anymore
                        oldFocusedOption.markAsBlurred();
                    }
                    this.focusedOptionName = newFocusedOptionName;
                }
            },

            /**
             * @param {string} newActiveOptionName
             * @private
             */
            _setActiveOptionName: function (newActiveOptionName) {
                var oldActiveOptionName = this.activeOptionName,
                    oldActiveOption;
                if (oldActiveOptionName !== newActiveOptionName) {
                    oldActiveOption = this.getChild(oldActiveOptionName);
                    if (oldActiveOption) {
                        // old active option might not be a child anymore
                        oldActiveOption.markAsInactive();
                    }
                    this.activeOptionName = newActiveOptionName;
                }
            },

            /**
             * Looks into current options and sets active option name.
             * @private
             */
            _updateFocusedOptionName: function () {
                this.focusedOptionName = this.getFocusedOption().childName;
            },

            /**
             * Looks into current options and sets active option name.
             * @private
             */
            _updateActiveOptionName: function () {
                this.activeOptionName = this.getSelectedOption().childName;
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @private
             */
            _onItemsChange: function (event) {
                this.setNextOriginalEvent(event);
                this._updateFocusedOptionName();
                this.clearNextOriginalEvent();
            },

            /**
             * TODO: break up into smaller methods
             * @param {shoeshine.WidgetEvent} event
             * @private
             */
            _onHotKeyPress: function (event) {
                var charCode = event.payload.charCode,
                    children = this.children,
                    sortedChildNames = children.getKeys().sort(),
                    currentChildIndex = sortedChildNames.indexOf(this.focusedOptionName),
                    newFocusedOptionName;

                this.setNextOriginalEvent(event);

                switch (charCode) {
                case 38: // up
                    currentChildIndex = Math.max(currentChildIndex - 1, 0);
                    newFocusedOptionName = sortedChildNames[currentChildIndex];
                    this.getChild(newFocusedOptionName).markAsFocused();
                    break;

                case 40: // down
                    currentChildIndex = Math.min(currentChildIndex + 1, sortedChildNames.length - 1);
                    newFocusedOptionName = sortedChildNames[currentChildIndex];
                    this.getChild(newFocusedOptionName).markAsFocused();
                    break;

                case 27: // esc
                    this.triggerSync(this.EVENT_OPTIONS_ESCAPE);
                    break;

                case 13: // enter
                    this.getChild(this.focusedOptionName).markAsActive();
                    break;
                }

                this.clearNextOriginalEvent();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @private
             */
            _onOptionFocus: function (event) {
                var newFocusedOptionName = event.senderWidget.childName;

                this.setNextOriginalEvent(event);
                this._setFocusedOptionName(newFocusedOptionName);
                this.clearNextOriginalEvent();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            _onOptionActive: function (event) {
                var optionWidget = event.senderWidget;

                this.setNextOriginalEvent(event);
                this._triggerSelectEvent(optionWidget.childName, optionWidget.optionValue);
                this.clearNextOriginalEvent();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @private
             */
            _onOptionSelect: function (event) {
                var optionName = event.payload.optionName;
                this._setActiveOptionName(optionName);
            }
        })
        .addMethods(/** @lends candystore.OptionList# */{
            /** Call from host's init. */
            init: function () {
                this
                    .elevateMethod('_onItemsChange')
                    .elevateMethod('_onHotKeyPress')
                    .elevateMethod('_onOptionFocus')
                    .elevateMethod('_onOptionActive')
                    .elevateMethod('_onOptionSelect');

                /**
                 * Identifier of option in focus.
                 * Name of corresponding child (item) widget.
                 * @type {string}
                 */
                this.focusedOptionName = undefined;

                /**
                 * Identifier of active option.
                 * Name of corresponding child widget.
                 * @type {string}
                 */
                this.activeOptionName = undefined;
            },

            /** Call from host's afterAdd. */
            afterAdd: function () {
                this
                    .subscribeTo(candystore.List.EVENT_LIST_ITEMS_CHANGE, this._onItemsChange)
                    .subscribeTo(candystore.HotKeyWatcher.EVENT_HOT_KEY_DOWN, this._onHotKeyPress)
                    .subscribeTo(candystore.Option.EVENT_OPTION_FOCUS, this._onOptionFocus)
                    .subscribeTo(candystore.Option.EVENT_OPTION_ACTIVE, this._onOptionActive)
                    .subscribeTo(candystore.OptionList.EVENT_OPTION_SELECT, this._onOptionSelect);

                this._updateFocusedOptionName();
                this._updateActiveOptionName();
            },

            /**
             * Fetches option widget based on its option value.
             * TODO: maintain an lookup of option values -> option widgets.
             * @param {*} optionValue
             * @returns {candystore.Option}
             */
            getOptionByValue: function (optionValue) {
                return this.children
                    .filterBySelector(function (option) {
                        return option.optionValue === optionValue;
                    })
                    .getFirstValue();
            },

            /**
             * Fetches currently focused option, or an arbitrary option if none focused.
             * @returns {candystore.Option}
             */
            getFocusedOption: function () {
                var focusedOption = this.children.filterBySelector(
                        function (option) {
                            return option.isFocused();
                        })
                        .getFirstValue(),
                    firstOption = this.children.getFirstValue();

                return focusedOption || firstOption;
            },

            /**
             * Fetches option that is currently selected, or undefined.
             * @returns {candystore.Option}
             */
            getSelectedOption: function () {
                return this.children.filterBySelector(
                    function (option) {
                        return option.isActive();
                    })
                    .getFirstValue();
            },

            /**
             * Selects an option on the list.
             * Call only when the current OptionList is added to the hierarchy.
             * @param {string} optionName
             * @returns {candystore.OptionList}
             */
            selectOption: function (optionName) {
                dessert.assert(this.isOnRoot(), "Not attached to root");

                var option = this.getChild(optionName);
                dessert.assert(!!option, "Invalid option name");
                option.markAsActive();

                return this;
            }
        });
});
