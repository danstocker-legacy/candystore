/*global dessert, troop, sntls, e$, shoeshine, candystore */
troop.postpone(candystore, 'OptionList', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Trait for modifying Lists to be used in Dropdowns.
     * Should only accept widgets as list items that implement the Option trait.
     * @class
     * @extends troop.Base
     * @extends candystore.List
     */
    candystore.OptionList = self
        .addConstants(/** @lends candystore.OptionList */{
            /** @constant */
            EVENT_OPTION_FOCUS: 'option-focus',

            /** @constant */
            EVENT_OPTION_BLUR: 'option-blur',

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
             * @param {*} optionName
             * @private
             */
            _triggerFocusEvent: function (optionName) {
                this.triggerSync(this.EVENT_OPTION_FOCUS, {
                    optionName: optionName
                });
            },

            /**
             * @param {*} optionName
             * @private
             */
            _triggerBlurEvent: function (optionName) {
                this.triggerSync(this.EVENT_OPTION_BLUR, {
                    optionName: optionName
                });
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

            /**
             * TODO: perhaps use Highlightable trait for children when ready
             * @param {string} newFocusedOptionName
             * @private
             */
            _updateFocusedOptionName: function (newFocusedOptionName) {
                var oldFocusedOptionName = this.focusedOptionName,
                    oldFocusedOption = this.getChild(oldFocusedOptionName);

                if (oldFocusedOptionName !== newFocusedOptionName) {
                    if (oldFocusedOption) {
                        oldFocusedOption.removeCssClass('focused-option');
                    }

                    this.getChild(newFocusedOptionName).addCssClass('focused-option');

                    this.focusedOptionName = newFocusedOptionName;

                    this._triggerBlurEvent(oldFocusedOptionName);
                    this._triggerFocusEvent(newFocusedOptionName);
                }
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
                    this._updateFocusedOptionName(newFocusedOptionName);
                    break;

                case 40: // down
                    currentChildIndex = Math.min(currentChildIndex + 1, sortedChildNames.length - 1);
                    newFocusedOptionName = sortedChildNames[currentChildIndex];
                    this._updateFocusedOptionName(newFocusedOptionName);
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
            _onOptionHover: function (event) {
                var newFocusedOptionName = event.senderWidget.childName;

                this.setNextOriginalEvent(event);
                this._updateFocusedOptionName(newFocusedOptionName);
                this.clearNextOriginalEvent();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            _onOptionClick: function (event) {
                var optionWidget = event.senderWidget;

                this.setNextOriginalEvent(event);
                this._triggerSelectEvent(optionWidget.childName, optionWidget.optionValue);
                this.clearNextOriginalEvent();
            }
        })
        .addMethods(/** @lends candystore.OptionList# */{
            /**
             * Call from host's init.
             */
            init: function () {
                this
                    .elevateMethod('_onHotKeyPress')
                    .elevateMethod('_onOptionHover')
                    .elevateMethod('_onOptionClick');

                /**
                 * Identifier of option in focus.
                 * Name of corresponding child widget.
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

            /**
             * Call from host's afterAdd.
             */
            afterAdd: function () {
                var focusedOptionName = this._getChildNameAtIndex(0);
                if (focusedOptionName) {
                    this._updateFocusedOptionName(focusedOptionName);
                }

                this
                    .subscribeTo(candystore.HotKeyWatcher.EVENT_HOT_KEY_DOWN, this._onHotKeyPress)
                    .subscribeTo(candystore.Option.EVENT_OPTION_HOVER, this._onOptionHover)
                    .subscribeTo(candystore.Option.EVENT_OPTION_CLICK, this._onOptionClick);
            }
        });
});
