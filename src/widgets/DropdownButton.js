/*global dessert, troop, sntls, evan, shoeshine, candystore */
troop.postpone(candystore, 'DropdownButton', function (ns, className) {
    "use strict";

    var base = candystore.TextButton,
        self = base.extend(className);

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
     * @class
     * @extends candystore.TextButton
     */
    candystore.DropdownButton = self
        .addPrivateMethods(/** @lends candystore.DropdownButton# */{
            /** @private */
            _updateOpenStyle: function () {
                var dropdown = this.dropdown;
                if (dropdown && dropdown.isOpen) {
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

                /**
                 * Dropdown widget for showing the options.
                 * Must have instance-level reference to it since this widget will be removed and re-added
                 * to the widget hierarchy.
                 * @type {candystore.Dropdown}
                 */
                this.dropdown = this.spawnDropdownWidget()
                    .setChildName('dropdown-popup');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateOpenStyle();

                this
                    .subscribeTo(candystore.Popup.EVENT_POPUP_OPEN, this.onDropdownOpen)
                    .subscribeTo(candystore.Popup.EVENT_POPUP_CLOSE, this.onDropdownClose);
            },

            /**
             * Creates dropdown widget.
             * Override to specify custom dropdown.
             * @returns {candystore.Dropdown}
             */
            spawnDropdownWidget: function () {
                return candystore.Dropdown.create();
            },

            /**
             * Retrieves Dropdown instance associated with DropdownButton.
             * @returns {candystore.Dropdown}
             */
            getDropdownWidget: function () {
                return this.getChild('dropdown-popup');
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onDropdownOpen: function (event) {
                if (event.senderWidget === this.dropdown) {
                    this._updateOpenStyle();
                }
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onDropdownClose: function (event) {
                if (event.senderWidget === this.dropdown) {
                    this._updateOpenStyle();
                }
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onClick: function (event) {
                base.onClick.call(this);

                var dropdown = this.dropdown,
                    link = evan.pushOriginalEvent(event);

                if (dropdown.isOpen) {
                    dropdown
                        .closePopup();
                } else {
                    dropdown
                        .addToParent(this)
                        .openPopup();
                }

                link.unLink();
            }
        });
});
