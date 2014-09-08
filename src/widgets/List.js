/*global dessert, troop, sntls, s$, app */
troop.postpone(app.widgets, 'List', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = s$.Widget,
        self = base.extend(className);

    /**
     * @name app.widgets.List.create
     * @function
     * @returns {app.widgets.List}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     */
    app.widgets.List = self
        .addMethods(/** @lends app.widgets.List# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('ul');
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.children.toString();
            },

            /**
             * @param itemWidget
             * @returns {app.widgets.List}
             */
            addItemWidget: function (itemWidget) {
                itemWidget
                    .setTagName('li')
                    .addToParent(this);

                return this;
            }
        });
});
