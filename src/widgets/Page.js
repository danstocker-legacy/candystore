/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Page', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * @name candystore.Page.create
     * @function
     * @returns {candystore.Page}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     */
    candystore.Page = self
        .addPrivateMethods(/** @lends candystore.Page# */{
            /**
             * @returns {sntls.Collection}
             * @private
             */
            _getPageCssClasses: function () {
                return this.getBase().htmlAttributes.cssClasses
                    .mapValues(function (className) {
                        return 'page-' + className;
                    });
            }
        })
        .addMethods(/** @lends candystore.Page# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                var $body = $('body');
                this._getPageCssClasses()
                    .passEachItemTo($body.addClass, $body);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);

                var $body = $('body');
                this._getPageCssClasses()
                    .passEachItemTo($body.removeClass, $body);
            }
        });
}, jQuery);
