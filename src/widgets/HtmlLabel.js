/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'HtmlLabel', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = candystore.Label,
        self = base.extend(className);

    /**
     * @name candystore.HtmlLabel.create
     * @function
     * @returns {candystore.HtmlLabel}
     */

    /**
     * @class
     * @extends candystore.Label
     */
    candystore.HtmlLabel = self
        .addMethods(/** @lends candystore.HtmlLabel# */{
            /**
             * @param {string} labelText
             * @returns {candystore.Label}
             */
            setLabelText: function (labelText) {
                $(this.getElement())
                    .html(labelText);

                this.labelText = labelText;

                return this;
            },

            /** @ignore */
            contentMarkup: function () {
                return this.labelText;
            }
        });
}, jQuery);
