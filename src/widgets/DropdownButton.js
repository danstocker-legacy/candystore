/*global dessert, troop, sntls, shoeshine, candystore */
troop.postpone(candystore, 'DropdownButton', function (ns, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
            .addTrait(shoeshine.JqueryWidget);

    /**
     * Creates a DropdownButton instance.
     * @name candystore.DropdownButton.create
     * @function
     * @returns {candystore.DropdownButton}
     */

    /**
     * The DropdownButton, when activated, pops up a dropdown, from which the user may select an option,
     * and the selected option will be set as the dropdown button's current caption.
     * The DropdownButton changes its state as the dropdown opens and closes.
     * TODO: to be based on TextButton
     * @class
     * @extends shoeshine.Widget
     */
    candystore.DropdownButton = self
        .addPrivateMethods(/** @lends candystore.DropdownButton# */{
            /** @private */
            _updateCssClasses: function () {
                if (this.dropdown.isOpen) {
                    this
                        .removeCssClass('dropdown-closed')
                        .addCssClass('dropdown-open');
                } else {
                    this
                        .removeCssClass('dropdown-open')
                        .addCssClass('dropdown-closed');
                }
            }
        })
        .addMethods(/** @lends candystore.DropdownButton# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this
                    .elevateMethod('onDropdownOpen')
                    .elevateMethod('onDropdownClose');

                this.createLabelWidget()
                    .setChildName('dropdown-label')
                    .addToParent(this);

                /**
                 * Dropdown widget for showing the options.
                 * Must have instance-level reference to it since this widget will be removed and re-added
                 * to the widget hierarchy.
                 * @type {candystore.Dropdown}
                 */
                this.dropdown = this.createDropdownWidget()
                    .setChildName('dropdown-popup');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateCssClasses();

                this
                    .subscribeTo(candystore.Popup.EVENT_POPUP_OPEN, this.onDropdownOpen)
                    .subscribeTo(candystore.Popup.EVENT_POPUP_CLOSE, this.onDropdownClose);
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.getChild('dropdown-label').toString();
            },

            /**
             * Creates button label widget.
             * Override to specify custom label.
             * @returns {candystore.Label}
             */
            createLabelWidget: function () {
                return candystore.Label.create();
            },

            /**
             * Creates dropdown widget.
             * Override to specify custom dropdown.
             * @returns {candystore.Dropdown}
             */
            createDropdownWidget: function () {
                return candystore.Dropdown.create();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onDropdownOpen: function (event) {
                if (event.senderWidget === this.dropdown) {
                    this._updateCssClasses();
                }
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onDropdownClose: function (event) {
                if (event.senderWidget === this.dropdown) {
                    this._updateCssClasses();
                }
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onClick: function (event) {
                var dropdown = this.dropdown;

                this.setNextOriginalEvent(event);

                if (dropdown.isOpen) {
                    dropdown
                        .closePopup();
                } else {
                    dropdown
                        .addToParent(this)
                        .openPopup();

                    event.stopPropagation();
                }

                this.clearNextOriginalEvent();
            }
        });

    self.on('click', '', 'onClick');
});
