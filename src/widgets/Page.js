/*global dessert, troop, sntls, s$, jQuery, app */
troop.postpone(app.widgets, 'Page', function (/**app.widgets*/widgets, className, /**jQuery*/$) {
    "use strict";

    var base = s$.Widget,
        self = base.extend(className);

    /**
     * @name app.widgets.Page.create
     * @function
     * @returns {app.widgets.Page}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     */
    app.widgets.Page = self
        .addPrivateMethods(/** @lends app.widgets.Page# */{
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
        .addMethods(/** @lends app.widgets.Page# */{
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
