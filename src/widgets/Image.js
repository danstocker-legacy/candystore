/*global dessert, troop, sntls, e$, shoeshine, candystore */
troop.postpone(candystore, 'Image', function (ns, className) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * @name candystore.Image.create
     * @function
     * @returns {candystore.Image}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     */
    candystore.Image = self
        .addMethods(/** @lends candystore.Image# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this.setTagName('img');

                /** @type {string} */
                this.imageRoot = undefined;
            },

            /**
             * @param {string} imageRoot
             * @returns {candystore.Image}
             */
            setImageRoot: function (imageRoot) {
                this.imageRoot = imageRoot;
                return this;
            },

            /**
             * @param {string} imageUrl
             * @returns {candystore.Image}
             */
            setImageUrl: function (imageUrl) {
                this.addAttribute('src', [this.imageRoot, imageUrl].join('/'));
                return this;
            }
        });
});
