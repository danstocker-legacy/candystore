/*global dessert, troop, sntls, evan, s$, jQuery, candystore */
troop.postpone(candystore, 'HotKeyWatcher', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Static class that watches key events globally and broadcasts widget events in response.
     * Listen to candystore.HotKeyWatcher.EVENT_HOT_KEY_DOWN in any widget to get notified of
     * global key events. (Eg. for navigating within a custom control.)
     * @class
     * @extends troop.Base
     */
    candystore.HotKeyWatcher = self
        .addConstants(/** @lends candystore.HotKeyWatcher */{
            /** @constant */
            EVENT_HOT_KEY_DOWN: 'hot-key-down'
        })
        .addMethods(/** @lends candystore.HotKeyWatcher# */{
            /**
             * @param {jQuery.Event} event
             * @ignore
             */
            onKeyDown: function (event) {
                s$.Widget.rootWidget
                    .setNextOriginalEvent(event)
                    .broadcastSync(this.EVENT_HOT_KEY_DOWN, {
                        charCode: event.which
                    })
                    .clearNextOriginalEvent();
            }
        });
});

(function (/**jQuery*/$) {
    "use strict";

    $(document).on('keydown', function (event) {
        candystore.HotKeyWatcher.onKeyDown(event);
    });
}(jQuery));