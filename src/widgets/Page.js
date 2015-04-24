/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Page', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className)
            .addTraitAndExtend(candystore.BinaryStateful)
            .addTrait(candystore.Disableable);

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
     * @extends candystore.BinaryStateful
     * @extends candystore.Disableable
     */
    candystore.Page = self
        .addPrivateMethods(/** @lends candystore.Page# */{
            /**
             * @returns {sntls.Collection}
             * @private
             */
            _getPageCssClasses: function () {
                return this.getBase().htmlAttributes.cssClasses
                    .mapValues(function (refCount, className) {
                        return 'page-' + className;
                    });
            }
        })
        .addMethods(/** @lends candystore.Page# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                candystore.BinaryStateful.init.call(this);
                candystore.Disableable.init.call(this);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                candystore.BinaryStateful.afterAdd.call(this);

                var documentBody = candystore.DocumentBody.create();

                this._getPageCssClasses()
                    .passEachItemTo(documentBody.addCssClass, documentBody);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                candystore.BinaryStateful.afterRemove.call(this);

                var documentBody = candystore.DocumentBody.create();

                this._getPageCssClasses()
                    .passEachItemTo(documentBody.decreaseRefCount, documentBody);
            }
        });
}, jQuery);
