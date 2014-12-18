/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'ResizeWatcher', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend(),
        $window = window && $(window);

    /**
     * Creates a ResizeWatcher instance, or pulls up an existing one from registry.
     * @name candystore.ResizeWatcher.create
     * @function
     * @returns {candystore.ResizeWatcher}
     */

    /**
     * Singleton that watches window resize events and broadcasts debounced (100ms) widget events in response.
     * Listen to candystore.ResizeWatcher.EVENT_WINDOW_RESIZE_DEBOUNCED in any widget to get
     * notified of changes to window size.
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
        .addMethods(/** @lends candystore.ResizeWatcher# */{
            /** @ignore */
            init: function () {
                this.elevateMethod('onDebouncedWindowResize');

                /**
                 * Stores current window width.
                 * @type {number}
                 */
                this.curentWidth = undefined;

                /**
                 * Stores current window height.
                 * @type {number}
                 */
                this.curentHeight = undefined;

                /**
                 * Debouncer instance for debouncing window resize events, which may come in rapid succession.
                 * @type {candystore.Debouncer}
                 */
                this.windowResizeDebouncer = candystore.Debouncer.create(this.onDebouncedWindowResize);

                // setting initial dimensions
                this.updateDimensions();
            },

            /**
             * Updates window dimensions, and triggers widget event about resizing.
             * @returns {candystore.ResizeWatcher}
             */
            updateDimensions: function () {
                var currentWidth = $window.width(),
                    currentHeight = $window.height(),
                    wasWindowResized = false,
                    rootWidget = shoeshine.Widget.rootWidget;

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
            },

            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onDebouncedWindowResize: function (event) {
                var rootWidget = shoeshine.Widget.rootWidget;
                if (rootWidget) {
                    rootWidget.setNextOriginalEvent(event);
                    this.updateDimensions();
                    rootWidget.clearNextOriginalEvent();
                }
            }
        });
}, jQuery);

(function (/**jQuery*/$) {
    "use strict";

    if (window) {
        $(window).on('resize', function (event) {
            candystore.ResizeWatcher.create()
                .onWindowResize(event);
        });

        $(function () {
            candystore.ResizeWatcher.create()
                .updateDimensions();
        });
    }
}(jQuery));