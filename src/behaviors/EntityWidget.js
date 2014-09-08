/*global dessert, troop, sntls, shoeshine, candystore */
troop.postpone(candystore, 'EntityWidget', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Expects to be added to widget classes.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     */
    candystore.EntityWidget = self
        .addConstants(/** @lends candystore.EntityWidget */{
            /** @constant */
            ATTRIBUTE_NAME_ENTITY_KEY: 'data-entity-key'
        })
        .addMethods(/** @lends candystore.EntityWidget# */{
            /**
             * @param {bookworm.EntityKey} entityKey
             */
            init: function (entityKey) {
                /** @type {bookworm.EntityKey} */
                this.entityKey = entityKey;
            },

            /**
             * @returns {candystore.EntityWidget}
             */
            revealKey: function () {
                this.addAttribute(this.ATTRIBUTE_NAME_ENTITY_KEY, this.entityKey.toString());
                return this;
            },

            /**
             * @returns {candystore.EntityWidget}
             */
            hideKey: function () {
                this.removeAttribute(this.ATTRIBUTE_NAME_ENTITY_KEY);
                return this;
            }
        });
});

troop.postpone(candystore, 'revealKeys', function () {
    "use strict";

    candystore.revealKeys = function () {
        shoeshine.Widget.rootWidget.getAllDescendants()
            .callOnEachItem('revealKey');
    };
});

troop.postpone(candystore, 'hideKeys', function () {
    "use strict";

    candystore.hideKeys = function () {
        shoeshine.Widget.rootWidget.getAllDescendants()
            .callOnEachItem('hideKey');
    };
});
