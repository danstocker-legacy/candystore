/*global dessert, troop, sntls, jQuery, candystore */
troop.postpone(candystore, 'AlignedPopup', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = candystore.Popup,
        self = base.extend();

    /**
     * @class
     * @extends candystore.Popup
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
                this.subscribeTo(candystore.ResizeWatcher.EVENT_WINDOW_RESIZE_DEBOUNCED, this.onResize);
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
             * @returns {candystore.AlignedPopup}
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