/*global dessert, troop, sntls, e$, s$, jQuery, app */
troop.postpone(app.widgets, 'TextButton', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = widgets.Button,
        self = base.extend(className);

    /**
     * @name app.widgets.TextButton.create
     * @function
     * @returns {app.widgets.TextButton}
     */

    /**
     * @class
     * @extends app.widgets.Button
     */
    app.widgets.TextButton = self
        .addMethods(/** @lends app.widgets.TextButton# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this.createLabelWidget()
                    .setChildName('caption')
                    .addToParent(this);
            },

            /**
             * @ignore
             * @returns {string}
             */
            contentMarkup: function () {
                return this.children.toString();
            },

            /**
             * Override for button-specific Label implementation.
             * @returns {app.widgets.Label}
             */
            createLabelWidget: function () {
                return widgets.Label.create();
            },

            /**
             * @param {string} caption
             * @returns {app.widgets.TextButton}
             */
            setCaption: function (caption) {
                dessert.isString(caption, "Invalid label text");

                this.getChild('caption')
                    .setLabelText(caption);

                return this;
            }
        });
});
