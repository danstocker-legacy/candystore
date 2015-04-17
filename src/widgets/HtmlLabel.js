/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'HtmlLabel', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = candystore.Label,
        self = base.extend(className);

    /**
     * Creates an HtmlLabel instance.
     * @name candystore.HtmlLabel.create
     * @function
     * @returns {candystore.HtmlLabel}
     */

    /**
     * Label that is able to display HTML markup.
     * @class
     * @extends candystore.Label
     * @deprecated
     * Use candystore.Label with htmlEscaped set to false.
     */
    candystore.HtmlLabel = self
        .addMethods(/** @lends candystore.HtmlLabel# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.htmlEscaped = false;
            }
        });
}, jQuery);
