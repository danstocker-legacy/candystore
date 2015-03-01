/*global Event, dessert, troop, sntls, evan, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'HotKeyWatcher', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Static class that watches key events globally and broadcasts widget events in response.
     * Listen to candystore.HotKeyWatcher.EVENT_HOT_KEY_DOWN in any widget to get notified of
     * global key events. (Eg. for navigating within a custom control.)
     * In case you want to suppress hotkey events originating from eg. Input widgets,
     * query the original events and look at the target that received the keydown.
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
                var rootWidget = shoeshine.Widget.rootWidget,
                    keyboardEvent = event.originalEvent,
                    originWidget = keyboardEvent instanceof Event &&
                                   keyboardEvent.toWidget() ||
                                   rootWidget;

                evan.eventPropertyStack.pushOriginalEvent(event);

                rootWidget.broadcastSync(this.EVENT_HOT_KEY_DOWN, {
                    charCode    : event.which,
                    originWidget: originWidget
                });

                evan.eventPropertyStack.popOriginalEvent();
            }
        });
});

(function (/**jQuery*/$) {
    "use strict";

    if (document) {
        $(document).on('keydown', function (event) {
            candystore.HotKeyWatcher.onKeyDown(event);
        });
    }
}(jQuery));