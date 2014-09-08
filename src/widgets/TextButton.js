/*global dessert, troop, sntls, e$, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'TextButton', function (ns, className) {
    "use strict";

    var base = candystore.Button,
        self = base.extend(className);

    /**
     * @name candystore.TextButton.create
     * @function
     * @returns {candystore.TextButton}
     */

    /**
     * @class
     * @extends candystore.Button
     */
    candystore.TextButton = self
        .addMethods(/** @lends candystore.TextButton# */{
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
             * @returns {candystore.Label}
             */
            createLabelWidget: function () {
                return candystore.Label.create();
            },

            /**
             * @param {string} caption
             * @returns {candystore.TextButton}
             */
            setCaption: function (caption) {
                dessert.isString(caption, "Invalid label text");

                this.getChild('caption')
                    .setLabelText(caption);

                return this;
            }
        });
});
