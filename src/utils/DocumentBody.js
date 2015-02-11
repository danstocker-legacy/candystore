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
        .setInstanceMapper(function () {
            return 'singleton';
        })
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

                /**
                 * @type {string}
                 * @private
                 */
                this._contentMarkup = '';
            },

            /**
             * @param {string} contentMarkup
             * @returns {candystore.DocumentBody}
             */
            setContentMarkup: function (contentMarkup) {
                this._contentMarkup = contentMarkup;
                return this;
            },

            /**
             * Fetches body element from document.
             * @returns {HTMLElement}
             */
            getElement: function () {
                return this._getBodyElementProxy();
            },

            /**
             * @returns {string}
             */
            contentMarkup: function () {
                return this._contentMarkup;
            }
        });
});
