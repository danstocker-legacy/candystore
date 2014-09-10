/*global dessert, troop, sntls, e$, shoeshine, candystore */
troop.postpone(candystore, 'Button', function (ns, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
            .addTrait(shoeshine.JqueryWidget)
            .addTrait(candystore.Disableable);

    /**
     * Creates a Button instance.
     * @name candystore.Button.create
     * @function
     * @returns {candystore.Button}
     */

    /**
     * General purpose button widget.
     * Supports disabling and click events.
     * @class
     * @extends shoeshine.Widget
     * @extends shoeshine.JqueryWidget
     * @extends candystore.Disableable
     */
    candystore.Button = self
        .addConstants(/** @lends candystore.Button */{
            /** @constants */
            EVENT_BUTTON_CLICK: 'button-click'
        })
        .addMethods(/** @lends candystore.Button# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                candystore.Disableable.init.call(this);
            },

            /**
             * @param {jQuery.Event} event
             * @ignore */
            onClick: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .triggerSync(this.EVENT_BUTTON_CLICK)
                    .clearNextOriginalEvent();
            }
        });

    self.on('click', '.Button.widget-enabled', 'onClick');
});
