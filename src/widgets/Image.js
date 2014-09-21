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

                /** @type {poodle.ImageUrl} */
                this.imageUrl = undefined;
            },

            /**
             * Sets absolute image URL.
             * @param {poodle.ImageUrl} imageUrl ImageUrl instance.
             * @example
             * image.setImageUrl('http://httpcats.herokuapp.com/418'.toImageUrl())
             * @returns {candystore.Image}
             */
            setImageUrl: function (imageUrl) {
                dessert.isLocation(imageUrl, "Invalid image URL");
                this.addAttribute('src', imageUrl.toString());
                this.imageUrl = imageUrl;
                return this;
            }
        });
});
