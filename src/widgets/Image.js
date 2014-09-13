/*global dessert, troop, sntls, evan, shoeshine, candystore */
troop.postpone(candystore, 'Image', function (ns, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * Creates an Image instance.
     * @name candystore.Image.create
     * @function
     * @returns {candystore.Image}
     */

    /**
     * The Image displays an <em>img</em> tag.
     * @class
     * @extends shoeshine.Widget
     */
    candystore.Image = self
        .addMethods(/** @lends candystore.Image# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this.setTagName('img');

                /**
                 * Root path or URL associated with Image instance.
                 * @type {string}
                 */
                this.imageRoot = undefined;
            },

            /**
             * Sets root path (URL) for the image.
             * @param {string} imageRoot
             * @returns {candystore.Image}
             */
            setImageRoot: function (imageRoot) {
                this.imageRoot = imageRoot;
                return this;
            },

            /**
             * Sets Image URL or path relative to the image root specified by .setImageRoot()
             * @param {string} imageUrl
             * @returns {candystore.Image}
             * @see candystore.Image#setImageRoot
             */
            setImageUrl: function (imageUrl) {
                this.addAttribute('src', [this.imageRoot, imageUrl].join('/'));
                return this;
            }
        });
});
