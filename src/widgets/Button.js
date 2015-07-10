/*global dessert, troop, sntls, evan, shoeshine, candystore, jQuery */
troop.postpone(candystore, 'Button', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
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

                this.elevateMethod('onClick');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                candystore.BinaryStateful.afterAdd.call(this);
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                $(this.getElement())
                    .on('click', this.onClick);
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
                var link = evan.pushOriginalEvent(event);
                this.clickButton();
                link.unLink();
            }
        });
}, jQuery);
