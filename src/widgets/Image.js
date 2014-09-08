/*global dessert, troop, sntls, e$, s$, app */
troop.postpone(app.widgets, 'Image', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = s$.Widget,
        self = base.extend(className);

    /**
     * @name app.widgets.Image.create
     * @function
     * @returns {app.widgets.Image}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     */
    app.widgets.Image = self
        .addMethods(/** @lends app.widgets.Image# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this.setTagName('img');
            },

            /**
             * @param {string} imageUrl
             * @returns {app.widgets.Image}
             */
            setImageUrl: function (imageUrl) {
                this.addAttribute('src', imageUrl);
                return this;
            }
        });
});
