/*global dessert, troop, sntls, e$, shoeshine, candystore */
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
             * @param {number} index
             * @returns {string}
             * @private
             */
            _getChildNameAtIndex: function (index) {
                return this.children.getKeys().sort()[index];
            },

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

            /** @private */
            _tryFocusingOnFirstOption: function () {
                var focusedOptionName = this._getChildNameAtIndex(0),
                    focusedOption = this.getChild(focusedOptionName);

                if (focusedOption) {
                    focusedOption.markAsFocused();
                }
            },

            /**
             * @param {string} newFocusedOptionName
             * @private
             */
            _updateFocusedOptionName: function (newFocusedOptionName) {
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
            _updateActiveOptionName: function (newActiveOptionName) {
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
             * @param {shoeshine.WidgetEvent} event
             * @private
             */
            _onItemsChange: function (event) {
                this.setNextOriginalEvent(event);
                this._tryFocusingOnFirstOption();
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
                    newFocusedOptionName,
                    newFocusedOption;

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
                    newFocusedOption = this.getChild(this.focusedOptionName);
                    this._triggerSelectEvent(newFocusedOption.childName, newFocusedOption.optionValue);
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
                this._updateFocusedOptionName(newFocusedOptionName);
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
                this._updateActiveOptionName(optionName);
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
                this._tryFocusingOnFirstOption();

                this
                    .subscribeTo(candystore.List.EVENT_LIST_ITEMS_CHANGE, this._onItemsChange)
                    .subscribeTo(candystore.HotKeyWatcher.EVENT_HOT_KEY_DOWN, this._onHotKeyPress)
                    .subscribeTo(candystore.Option.EVENT_OPTION_FOCUS, this._onOptionFocus)
                    .subscribeTo(candystore.Option.EVENT_OPTION_ACTIVE, this._onOptionActive)
                    .subscribeTo(candystore.OptionList.EVENT_OPTION_SELECT, this._onOptionSelect);
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
             * Selects an option on the list.
             * @param {string} optionName
             * @returns {candystore.OptionList}
             */
            selectOption: function (optionName) {
                var option = this.getChild(optionName);
                dessert.assert(!!option, "Invalid option name");
                option.markAsActive();
                return this;
            }
        });
});
