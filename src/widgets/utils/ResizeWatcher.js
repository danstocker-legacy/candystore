/*global dessert, troop, sntls, s$, jQuery, candystore */
troop.postpone(candystore, 'ResizeWatcher', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend(),
        $window = $(window);

    /**
     * @name candystore.ResizeWatcher.create
     * @function
     * @returns {candystore.ResizeWatcher}
     */

    /**
     * Watches window resize events and broadcasts debounced widget events in response.
     * @class
     * @extends troop.Base
     */
    candystore.ResizeWatcher = self
        .setInstanceMapper(function () {
            return 'singleton';
        })
        .addConstants(/** @lends candystore.ResizeWatcher */{
            /** @constant */
            EVENT_WINDOW_RESIZE_DEBOUNCED: 'window-resize-debounced',

            /**
             * Delay in ms to wait between the last window resize event and
             * triggering the widget resize event.
             * @constant
             */
            RESIZE_DEBOUNCE_DELAY: 100
        })
        .addPrivateMethods(/** @lends candystore.ResizeWatcher# */{
            /** @private */
            _onWindowResize: function () {
                this.updateDimensions();
            }
        })
        .addMethods(/** @lends candystore.ResizeWatcher# */{
            /** @ignore */
            init: function () {
                this.elevateMethod('_onWindowResize');

                /** @type {number} */
                this.curentWidth = undefined;

                /** @type {number} */
                this.curentHeight = undefined;

                /** @type {candystore.Debouncer} */
                this.windowResizeDebouncer = candystore.Debouncer.create(this._onWindowResize);
            },

            /** @returns {candystore.ResizeWatcher} */
            updateDimensions: function () {
                var currentWidth = $window.width(),
                    currentHeight = $window.height(),
                    wasWindowResized = false,
                    rootWidget = s$.Widget.rootWidget;

                if (currentWidth !== this.currentWidth || currentHeight !== this.currentHeight) {
                    wasWindowResized = true;
                }

                this.currentWidth = currentWidth;
                this.currentHeight = currentHeight;

                if (wasWindowResized && rootWidget) {
                    rootWidget.broadcastSync(this.EVENT_WINDOW_RESIZE_DEBOUNCED);
                }

                return this;
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onWindowResize: function (event) {
                this.windowResizeDebouncer.runDebounced(this.RESIZE_DEBOUNCE_DELAY, event);
            }
        });
}, jQuery);

(function (/**jQuery*/$) {
    "use strict";

    $(window).on('resize', function (event) {
        candystore.ResizeWatcher.create()
            .onWindowResize(event);
    });

    $(function () {
        candystore.ResizeWatcher.create()
            .updateDimensions();
    });
}(jQuery));