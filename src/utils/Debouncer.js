/*global dessert, troop, sntls, app */
troop.postpone(app.utils, 'Debouncer', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend(),
        slice = Array.prototype.slice;

    /**
     * @name app.utils.Debouncer.create
     * @function
     * @param {function} originalFunction Function to debounce
     * @returns {app.utils.Debouncer}
     */

    /**
     * De-bounces a function. Calls to the specified function via .runDebounced will be rejected
     * by each subsequent call being made within the specified time frame.
     * @class
     * @extends troop.Base
     */
    app.utils.Debouncer = self
        .addPrivateMethods(/** @lends app.utils.Debouncer# */{
            /**
             * @param {function} func
             * @param {number} delay
             * @returns {number}
             * @private
             */
            _setTimeoutProxy: function (func, delay) {
                return window.setTimeout(func, delay);
            },

            /**
             * @param {number} timer
             * @private
             */
            _clearTimeoutProxy: function (timer) {
                return window.clearTimeout(timer);
            }
        })
        .addMethods(/** @lends app.utils.Debouncer# */{
            /**
             * @param {function} originalFunction Function to debounce
             * @ignore
             */
            init: function (originalFunction) {
                dessert.isFunction(originalFunction, "Invalid original function");

                /** @type {function} */
                this.originalFunction = originalFunction;

                /** @type {number} */
                this.debounceTimer = undefined;
            },

            /**
             * @param {number} delay
             * @returns {app.utils.Debouncer}
             */
            runDebounced: function (delay) {
                var debounceTimer = this.debounceTimer;

                if (debounceTimer) {
                    this._clearTimeoutProxy(debounceTimer);
                }

                var that = this,
                    args = slice.call(arguments, 1);

                this.debounceTimer = this._setTimeoutProxy(function () {
                    that.originalFunction.apply(that, args);
                    that.debounceTimer = undefined;
                }, delay);

                return this;
            }
        });
});
