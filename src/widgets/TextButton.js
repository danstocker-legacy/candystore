/*global dessert, troop, sntls, evan, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'TextButton', function (ns, className) {
    "use strict";

    var base = candystore.Button,
        self = base.extend(className);

    /**
     * Creates a TextButton instance.
     * @name candystore.TextButton.create
     * @function
     * @returns {candystore.TextButton}
     */

    /**
     * The TextButton extends the Button with a Label that stores text, so the button might have text on it.
     * @class
     * @extends candystore.Button
     */
    candystore.TextButton = self
        .addMethods(/** @lends candystore.TextButton# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this.spawnLabelWidget()
                    .setChildName('button-label')
                    .addToParent(this);
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.children.toString();
            },

            /**
             * Creates Label widget to be used inside the button.
             * Override to specify custom widget.
             * @returns {candystore.Label}
             */
            spawnLabelWidget: function () {
                return candystore.Label.create();
            },

            /**
             * Retrieves the label widget contained within the button.
             * @returns {candystore.Label}
             */
            getLabelWidget: function () {
                return this.getChild('button-label');
            },

            /**
             * Sets button caption.
             * Expects the caption widget to be a Label.
             * Override when caption widget is something other than Label.
             * @param {string} caption
             * @returns {candystore.TextButton}
             */
            setCaption: function (caption) {
                dessert.isString(caption, "Invalid label text");

                this.getChild('button-label')
                    .setLabelText(caption);

                return this;
            }
        });
});
