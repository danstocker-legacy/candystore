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
     */
    candystore.HtmlLabel = self
        .addMethods(/** @lends candystore.HtmlLabel# */{
            /** @ignore */
            contentMarkup: function () {
                var labelText = this.labelText;
                return labelText ? labelText : '';
            },

            /**
             * Sets HTML label text. Overrides Label's implementation.
             * <em>Use with care: malicious code in labelText can affect your application!</em>
             * @param {string} labelText
             * @returns {candystore.Label}
             */
            setLabelText: function (labelText) {
                dessert.isStringOptional(labelText, "Invalid label text");

                var element = this.getElement();
                if (element) {
                    $(element).html(labelText);
                }

                this.labelText = labelText;

                this.updateContentStyle();

                return this;
            }
        });
}, jQuery);
