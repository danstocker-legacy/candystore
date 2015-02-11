/*global dessert, troop, sntls, candystore */
troop.postpone(candystore, 'Editable', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The Editable trait provides a simple way to manage state changes for widgets that may operate
     * in two modes: display mode, and edit mode, each mode implementing a different markup.
     * TODO: Refactor .editMarkup() and .displayMarkup() into .editTemplate and .displayTemplate.
     * @class
     * @extends troop.Base
     * @extends candystore.BinaryStateful
     */
    candystore.Editable = self
        .addConstants(/** @lends candystore.Editable */{
            /** @constant */
            STATE_NAME_EDITABLE: 'state-editable',

            /**
             * Signals that the host has changed to edit mode.
             * @constant
             */
            EVENT_EDIT_MODE: 'edit-mode',

            /**
             * Signals that the host has changed to display mode.
             * @constant
             */
            EVENT_DISPLAY_MODE: 'display-mode'
        })
        .addPrivateMethods(/** @lends candystore.Editable# */{
            /** @private */
            _updateEditableState: function () {
                var eventName;

                // applying appropriate CSS classes
                if (this.isStateOn(this.STATE_NAME_EDITABLE)) {
                    eventName = this.EVENT_EDIT_MODE;

                    this.removeCssClass('display-mode')
                        .addCssClass('edit-mode');
                } else {
                    eventName = this.EVENT_DISPLAY_MODE;

                    this.removeCssClass('edit-mode')
                        .addCssClass('display-mode');
                }

                if (this.editMarkup || this.displayMarkup) {
                    // when host implements different markups for display and edit mode
                    // re-rendering appropriate content markup
                    this.reRenderContents();
                }

                // triggering event about state change
                this.spawnEvent(eventName)
                    .allowBubbling(false)
                    .triggerSync(this.eventPath);
            }
        })
        .addMethods(/** @lends candystore.Editable# */{
            /** Call from host's .init */
            init: function () {
                // expansion is not cascading (by default)
                this.addBinaryState(this.STATE_NAME_EDITABLE);
            },

            /** Call from host's .afterAdd */
            afterAdd: function () {
                this._updateEditableState();
            },

            /**
             * Call from host's .contentMarkup, and implement .editMarkup and .displayMarkup
             * if the host changes its markup between 'edit' and 'display' modes.
             * @returns {string}
             */
            contentMarkup: function () {
                return this.isStateOn(this.STATE_NAME_EDITABLE) ?
                    this.editMarkup() :
                    this.displayMarkup();
            },

            /**
             * Call from host's .afterStateOn.
             * @param {string} stateName
             */
            afterStateOn: function (stateName) {
                if (stateName === this.STATE_NAME_EDITABLE) {
                    this._updateEditableState();
                }
            },

            /**
             * Call from host's .afterStateOff.
             * @param {string} stateName
             */
            afterStateOff: function (stateName) {
                if (stateName === this.STATE_NAME_EDITABLE) {
                    this._updateEditableState();
                }
            },

            /**
             * Sets the host to edit mode.
             * @returns {candystore.Editable}
             */
            toEditMode: function () {
                this.addBinaryStateSource(this.STATE_NAME_EDITABLE, 'default');
                return this;
            },

            /**
             * Sets the host to display mode.
             * @returns {candystore.Editable}
             */
            toDisplayMode: function () {
                this.removeBinaryStateSource(this.STATE_NAME_EDITABLE, 'default');
                return this;
            },

            /**
             * Tells whether host is in edit mode.
             * @returns {boolean}
             */
            isInEditMode: function () {
                return this.isStateOn(this.STATE_NAME_EDITABLE);
            },

            /**
             * Tells whether host is in display mode.
             * @returns {boolean}
             */
            isInDisplayMode: function () {
                return !this.isStateOn(this.STATE_NAME_EDITABLE);
            }
        });

    /**
     * @name candystore.Editable#editMarkup
     * @function
     * @returns {string}
     */

    /**
     * @name candystore.Editable#displayMarkup
     * @function
     * @returns {string}
     */
});
