/*global dessert, troop, sntls, evan, shoeshine, candystore */
troop.postpone(candystore, 'DocumentBody', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend()
            .addTraitAndExtend(shoeshine.Renderable);

    /**
     * @name candystore.DocumentBody.create
     * @function
     * @returns {candystore.DocumentBody}
     */

    /**
     * @class
     * @extends troop.Base
     * @extends shoeshine.Renderable
     */
    candystore.DocumentBody = self
        .addPrivateMethods(/** @lends candystore.DocumentBody# */{
            /**
             * @returns {HTMLElement}
             * @private
             */
            _getBodyElementProxy: function () {
                return document && document.body;
            }
        })
        .addMethods(/** @lends candystore.DocumentBody# */{
            /** @ignore */
            init: function () {
                shoeshine.Renderable.init.call(this);
                this.setTagName('body');
            },

            /**
             * Fetches body element from document.
             * @returns {HTMLElement}
             */
            getElement: function () {
                return this._getBodyElementProxy();
            },

            /**
             * Includes the placeholder string "body-contents".
             * To fill with actual content, convert to Template, and use Template.fillPlaceholder().
             * @returns {string}
             */
            contentMarkup: function () {
                return '{{body-contents}}';
            }
        });
});
