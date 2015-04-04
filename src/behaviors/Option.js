/*global dessert, troop, sntls, evan, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Option', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The Option trait allows widgets to behave like option items in a dropdown or select list.
     * Add this trait to classes aimed to be used as options in a dropdown.
     * Expects host to have the Highlightable trait.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     * @extends candystore.BinaryStateful
     * @extends candystore.Highlightable
     */
    candystore.Option = self
        .addConstants(/** @lends candystore.Option */{
            /** @constant */
            EVENT_OPTION_FOCUS: 'option-focus',

            /** @constant */
            EVENT_OPTION_BLUR: 'option-blur',

            /** @constant */
            EVENT_OPTION_ACTIVE: 'option-active',

            /** @constant */
            EVENT_OPTION_INACTIVE: 'option-inactive',

            /** @constant */
            HIGHLIGHTED_FOCUS: 'highlighted-focus',

            /** @constant */
            HIGHLIGHTED_ACTIVE: 'highlighted-active'
        })
        .addMethods(/** @lends candystore.Option# */{
            /**
             * Call from host's init.
             * @param {*} [optionValue]
             */
            init: function (optionValue) {
                this
                    .elevateMethod('onOptionClick')
                    .elevateMethod('onOptionHover');

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
                var element = this.getElement();
                if (element) {
                    $(element)
                        .on('click', this.onOptionClick)
                        .on('mouseenter', this.onOptionHover);
                }
            },

            /**
             * Sets option value.
             * @param {*} optionValue
             * @returns {candystore.Option}
             */
            setOptionValue: function (optionValue) {
                this.optionValue = optionValue;
                return this;
            },

            /**
             * Marks current option as focused.
             * @returns {candystore.Option}
             */
            markAsFocused: function () {
                if (!this.isFocused()) {
                    this.highlightOn(this.HIGHLIGHTED_FOCUS)
                        .spawnEvent(this.EVENT_OPTION_FOCUS)
                        .setPayloadItems({
                            optionName : this.childName,
                            optionValue: this.optionValue
                        })
                        .triggerSync();
                }
                return this;
            },

            /**
             * Marks current option as no longer focused.
             * @returns {candystore.Option}
             */
            markAsBlurred: function () {
                if (this.isFocused()) {
                    this.highlightOff(this.HIGHLIGHTED_FOCUS)
                        .spawnEvent(this.EVENT_OPTION_BLUR)
                        .setPayloadItems({
                            optionName : this.childName,
                            optionValue: this.optionValue
                        })
                        .triggerSync();
                }
                return this;
            },

            /**
             * Tells whether the current option is focused.
             * @returns {boolean}
             */
            isFocused: function () {
                return this.isHighlighted(this.HIGHLIGHTED_FOCUS);
            },

            /**
             * Marks current option as active.
             * @returns {candystore.Option}
             */
            markAsActive: function () {
                if (!this.isActive()) {
                    this.highlightOn(this.HIGHLIGHTED_ACTIVE)
                        .spawnEvent(this.EVENT_OPTION_ACTIVE)
                        .setPayloadItems({
                            optionName : this.childName,
                            optionValue: this.optionValue
                        })
                        .triggerSync();
                }
                return this;
            },

            /**
             * Marks current option as inactive.
             * @returns {candystore.Option}
             */
            markAsInactive: function () {
                if (this.isActive()) {
                    this.highlightOff(this.HIGHLIGHTED_ACTIVE)
                        .spawnEvent(this.EVENT_OPTION_INACTIVE)
                        .setPayloadItems({
                            optionName : this.childName,
                            optionValue: this.optionValue
                        })
                        .triggerSync();
                }
                return this;
            },

            /**
             * Tells whether the current option is active.
             * @returns {boolean}
             */
            isActive: function () {
                return this.isHighlighted(this.HIGHLIGHTED_ACTIVE);
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onOptionClick: function (event) {
                var link = evan.pushOriginalEvent(event);
                this.markAsActive();
                link.unLink();
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onOptionHover: function (event) {
                var link = evan.pushOriginalEvent(event);
                this.markAsFocused();
                link.unLink();
            }
        });
}, jQuery);
