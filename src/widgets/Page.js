/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Page', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * Creates a Page instance.
     * @name candystore.Page.create
     * @function
     * @returns {candystore.Page}
     */

    /**
     * The Page class endows all pages with basic features, such as
     * adding relevant CSS classes to the <em>body</em> element.
     * Subclass to create page classes, and add them to he hierarchy as root.
     * @example
     * MyPage.create().setRootWidget();
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
