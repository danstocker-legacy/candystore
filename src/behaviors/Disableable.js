/*global dessert, troop, sntls, e$, s$, app */
troop.postpone(app.widgets, 'Disableable', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Trait that endows Renderable classes with an enabled - disabled state.
     * A Disableable may be disabled by multiple sources. All such sources have to
     * re-enable the host to be fully enabled again.
     * Expects to be added to a host that also has the Renderable trait.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Renderable
     */
    app.widgets.Disableable = self
        .addPrivateMethods(/** @lends app.widgets.Disableable# */{
            /** @private */
            _updateCssClasses: function () {
                if (this.isDisabled()) {
                    this.removeCssClass('widget-enabled')
                        .addCssClass('widget-disabled');
                } else {
                    this.removeCssClass('widget-disabled')
                        .addCssClass('widget-enabled');
                }
            }
        })
        .addMethods(/** @lends app.widgets.Disableable# */{
            /** Call from host's init. */
            init: function () {
                /** @type {sntls.Collection} */
                this.disablingSources = sntls.Collection.create();
                this.forceEnable();
            },

            /**
             * Releases all disabling sources at once.
             * @returns {app.widgets.Disableable}
             */
            forceEnable: function () {
                this.disablingSources.clear();
                this._updateCssClasses();
                return this;
            },

            /**
             * Enables the instance by the specified source.
             * @param {string} disablingSource
             * @returns {app.widgets.Disableable}
             */
            enableBy: function (disablingSource) {
                this.disablingSources.deleteItem(disablingSource);
                this._updateCssClasses();
                return this;
            },

            /**
             * Disables the instance by the specified source.
             * @param {string} disablingSource
             * @returns {app.widgets.Disableable}
             */
            disableBy: function (disablingSource) {
                this.disablingSources.setItem(disablingSource, disablingSource);
                this._updateCssClasses();
                return this;
            },

            /**
             * Tells whether the current instance is currently disabled.
             * @returns {boolean}
             */
            isDisabled: function () {
                return this.disablingSources.getKeyCount() > 0;
            }
        });
});
