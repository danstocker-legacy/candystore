/*global dessert, troop, sntls, evan, shoeshine, candystore */
troop.postpone(candystore, 'Disableable', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * The Disableable trait endows Widget classes with an enabled - disabled state.
     * A Disableable may be disabled by multiple sources. All such sources have to
     * re-enable the host to be fully enabled again.
     * Expects to be added to Widget instances.
     * Expects the host to have the BinaryStateful trait applied.
     * @class
     * @extends troop.Base
     * @extends candystore.BinaryStateful
     * @extends shoeshine.Widget
     */
    candystore.Disableable = self
        .addConstants(/** @lends candystore.Disableable */{
            /** @constant */
            STATE_NAME_DISABLEBABLE: 'state-disableable'
        })
        .addPrivateMethods(/** @lends candystore.Disableable# */{
            /** @private */
            _updateEnabledStyle: function () {
                if (this.isDisabled()) {
                    this.removeCssClass('widget-enabled')
                        .addCssClass('widget-disabled');
                } else {
                    this.removeCssClass('widget-disabled')
                        .addCssClass('widget-enabled');
                }
            }
        })
        .addMethods(/** @lends candystore.Disableable# */{
            /** Call from host's .init. */
            init: function () {
                this.addBinaryState(this.STATE_NAME_DISABLEBABLE, true);
            },

            /** Call from host's .afterStateOn */
            afterStateOn: function (stateName) {
                if (stateName === this.STATE_NAME_DISABLEBABLE) {
                    this._updateEnabledStyle();
                }
            },

            /** Call from host's .afterStateOff */
            afterStateOff: function (stateName) {
                if (stateName === this.STATE_NAME_DISABLEBABLE) {
                    this._updateEnabledStyle();
                }
            },

            /**
             * Disables the instance by the specified source.
             * @param {string} disablingSource
             * @returns {candystore.Disableable}
             */
            disableBy: function (disablingSource) {
                this.addBinaryStateSource(this.STATE_NAME_DISABLEBABLE, disablingSource);
                return this;
            },

            /**
             * Enables the instance by the specified source.
             * @param {string} disablingSource
             * @returns {candystore.Disableable}
             */
            enableBy: function (disablingSource) {
                this.removeBinaryStateSource(this.STATE_NAME_DISABLEBABLE, disablingSource);
                return this;
            },

            /**
             * Releases all disabling sources at once.
             * @returns {candystore.Disableable}
             */
            forceEnable: function () {
                this.removeBinaryStateSource(this.STATE_NAME_DISABLEBABLE);
                return this;
            },

            /**
             * Tells whether the current instance is currently disabled.
             * @returns {boolean}
             */
            isDisabled: function () {
                return this.isStateOn(this.STATE_NAME_DISABLEBABLE);
            }
        });
});
