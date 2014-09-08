/*global dessert, troop, sntls, jQuery, app */
troop.postpone(app.widgets, 'AlignedPopup', function (/**app.widgets*/widgets, className, /**jQuery*/$) {
    "use strict";

    var base = app.widgets.Popup,
        self = base.extend();

    /**
     * @class
     * @extends app.widgets.Popup
     */
    app.widgets.AlignedPopup = self
        .addPrivateMethods(/** @lends app.widgets.AlignedPopup# */{
            /** @private */
            _alignPopup: function () {
                $(this.getElement()).position(this.positionOptions.items);
            },

            /** @private */
            _updateOfPositionOption: function () {
                this.setPositionOption('of', $(this.parent.getElement()));
                return this;
            }
        })
        .addMethods(/** @lends app.widgets.AlignedPopup# */{
            /**
             * Call from host class' init.
             */
            init: function () {
                base.init.call(this);

                /**
                 * Options for positioning the select list popup around its parent.
                 * @type {sntls.Collection}
                 */
                this.positionOptions = sntls.Collection.create({
                    my: 'left top',
                    at: 'left bottom'
                });

                this.elevateMethod('onResize');
            },

            /**
             * Call from host class' afterAdd.
             */
            afterAdd: function () {
                base.afterAdd.call(this);
                this.subscribeTo(widgets.ResizeWatcher.EVENT_WINDOW_RESIZE_DEBOUNCED, this.onResize);
            },

            /**
             * Call from host class' afterRender.
             */
            afterRender: function () {
                base.afterRender.call(this);
                this._updateOfPositionOption();
            },

            /**
             * @param {string} optionName
             * @param {*} [optionValue]
             * @returns {app.widgets.AlignedPopup}
             */
            setPositionOption: function (optionName, optionValue) {
                if (typeof optionValue === 'undefined') {
                    this.positionOptions.deleteItem(optionName);
                } else {
                    this.positionOptions.setItem(optionName, optionValue);
                }
                this._alignPopup();
                return this;
            },

            /** @ignore */
            onResize: function () {
                this._alignPopup();
            }
        });
}, jQuery);