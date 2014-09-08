/*global dessert, troop, sntls, e$, s$, app */
troop.postpone(app.widgets, 'Button', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = s$.Widget,
        self = base.extend(className)
            .addTrait(s$.JqueryWidget)
            .addTrait(widgets.Disableable);

    /**
     * Creates a Button instance.
     * @name app.widgets.Button.create
     * @function
     * @returns {app.widgets.Button}
     */

    /**
     * General purpose button widget.
     * Supports disabling and click events.
     * @class
     * @extends shoeshine.Widget
     * @extends shoeshine.JqueryWidget
     * @extends app.widgets.Disableable
     */
    app.widgets.Button = self
        .addConstants(/** @lends app.widgets.Button */{
            /** @constants */
            EVENT_BUTTON_CLICK: 'button-click'
        })
        .addMethods(/** @lends app.widgets.Button# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                widgets.Disableable.init.call(this);
            },

            /** @ignore */
            onClick: function () {
                this.triggerSync(this.EVENT_BUTTON_CLICK);
            }
        });

    self.on('click', '.Button.widget-enabled', 'onClick');
});
