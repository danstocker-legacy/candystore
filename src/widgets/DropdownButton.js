/*global dessert, troop, sntls, s$, app */
troop.postpone(app.widgets, 'DropdownButton', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = s$.Widget,
        self = base.extend(className)
            .addTrait(s$.JqueryWidget);

    /**
     * @name app.widgets.DropdownButton.create
     * @function
     * @returns {app.widgets.DropdownButton}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     */
    app.widgets.DropdownButton = self
        .addPrivateMethods(/** @lends app.widgets.DropdownButton# */{
            /** @private */
            _updateCssClasses: function () {
                if (this.dropdownList.isOpen) {
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
        .addMethods(/** @lends app.widgets.DropdownButton# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this
                    .elevateMethod('onDropdownOpen')
                    .elevateMethod('onDropdownClose');

                this.createLabelWidget()
                    .setChildName('dropdown-label')
                    .addToParent(this);

                /** @type {app.widgets.Dropdown} */
                this.dropdownList = this.createDropdownListWidget();
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateCssClasses();

                this
                    .subscribeTo(widgets.Popup.EVENT_POPUP_OPEN, this.onDropdownOpen)
                    .subscribeTo(widgets.Popup.EVENT_POPUP_CLOSE, this.onDropdownClose);
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.getChild('dropdown-label').toString();
            },

            /**
             * Override to specify custom label.
             * @returns {app.widgets.Label}
             */
            createLabelWidget: function () {
                return widgets.Label.create();
            },

            /**
             * Override to specify custom dropdown list.
             * @returns {app.widgets.Dropdown}
             */
            createDropdownListWidget: function () {
                return widgets.Dropdown.create();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onDropdownOpen: function (event) {
                if (event.senderWidget === this.dropdownList) {
                    this._updateCssClasses();
                }
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onDropdownClose: function (event) {
                if (event.senderWidget === this.dropdownList) {
                    this._updateCssClasses();
                }
            },

            /** @ignore */
            onClick: function (event) {
                this.dropdownList
                    .setChildName('dropdown-list')
                    .addToParent(this)
                    .openPopup();

                event.stopPropagation();
            }
        });

    self.on('click', '', 'onClick');
});
