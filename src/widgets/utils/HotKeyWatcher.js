/*global dessert, troop, sntls, e$, s$, jQuery, candystore */
troop.postpone(candystore, 'HotKeyWatcher', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
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