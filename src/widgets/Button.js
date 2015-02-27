/*global dessert, troop, sntls, evan, shoeshine, candystore */
troop.postpone(candystore, 'Button', function (ns, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
            .addTrait(shoeshine.JqueryWidget)
            .addTraitAndExtend(candystore.BinaryStateful)
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
     * @extends candystore.BinaryStateful
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
                candystore.BinaryStateful.init.call(this);
                candystore.Disableable.init.call(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                candystore.BinaryStateful.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                candystore.BinaryStateful.afterRemove.call(this);
            },

            /**
             * Clicks the button.
             * @returns {candystore.Button}
             */
            clickButton: function () {
                if (!this.isDisabled()) {
                    this.triggerSync(this.EVENT_BUTTON_CLICK);
                }
                return this;
            },

            /**
             * @param {jQuery.Event} event
             * @ignore */
            onClick: function (event) {
                evan.eventSpaceRegistry.pushOriginalEvent(event);
                this.clickButton();
                evan.eventSpaceRegistry.popOriginalEvent();
            }
        });

    self.on('click', '.Button.widget-enabled', 'onClick');
});
