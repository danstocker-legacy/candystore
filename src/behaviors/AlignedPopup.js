/*global dessert, troop, sntls, jQuery, candystore */
troop.postpone(candystore, 'AlignedPopup', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = candystore.Popup,
        self = base.extend();

    /**
     * The AlignedPopup trait extends the Popup trait with aligning the widget's DOM to the DOM of its parent.
     * Relies on jQuery UI's positioning.
     * @class
     * @extends candystore.Popup
     * @link http://api.jqueryui.com/position
     */
    candystore.AlignedPopup = self
        .addPrivateMethods(/** @lends candystore.AlignedPopup# */{
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
        .addMethods(/** @lends candystore.AlignedPopup# */{
            /** Call from host class' init. */
            init: function () {
                base.init.call(this);

                this.elevateMethod('onResize');

                /**
                 * Options for positioning the select list popup around its parent.
                 * @type {sntls.Collection}
                 */
                this.positionOptions = sntls.Collection.create({
                    my: 'left top',
                    at: 'left bottom'
                });
            },

            /** Call from host class' afterAdd. */
            afterAdd: function () {
                base.afterAdd.call(this);
                this.subscribeTo(candystore.ResizeWatcher.EVENT_WINDOW_RESIZE_DEBOUNCED, this.onResize);
            },

            /** Call from host class' afterRender. */
            afterRender: function () {
                base.afterRender.call(this);
                this._updateOfPositionOption();
            },

            /**
             * Sets jQuery UI position option. Accepts any options combination that jQuery UI's .position() does.
             * @param {string} optionName
             * @param {*} [optionValue]
             * @returns {candystore.AlignedPopup}
             * @link http://api.jqueryui.com/position/
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