/*global dessert, troop, sntls, s$, app */
troop.postpone(app.widgets, 'EntityWidget', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Expects to be added to widget classes.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     */
    app.widgets.EntityWidget = self
        .addConstants(/** @lends app.widgets.EntityWidget */{
            /** @constant */
            ATTRIBUTE_NAME_ENTITY_KEY: 'data-entity-key'
        })
        .addMethods(/** @lends app.widgets.EntityWidget# */{
            /**
             * @param {bookworm.EntityKey} entityKey
             */
            init: function (entityKey) {
                /** @type {bookworm.EntityKey} */
                this.entityKey = entityKey;
            },

            /**
             * @returns {app.widgets.EntityWidget}
             */
            revealKey: function () {
                this.addAttribute(this.ATTRIBUTE_NAME_ENTITY_KEY, this.entityKey.toString());
                return this;
            },

            /**
             * @returns {app.widgets.EntityWidget}
             */
            hideKey: function () {
                this.removeAttribute(this.ATTRIBUTE_NAME_ENTITY_KEY);
                return this;
            }
        });
});

troop.postpone(app, 'revealKeys', function () {
    "use strict";

    app.revealKeys = function () {
        s$.Widget.rootWidget.getAllDescendants()
            .callOnEachItem('revealKey');
    };
});

troop.postpone(app, 'hideKeys', function () {
    "use strict";

    app.hideKeys = function () {
        s$.Widget.rootWidget.getAllDescendants()
            .callOnEachItem('hideKey');
    };
});
