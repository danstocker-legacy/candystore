/*global dessert, troop, sntls, e$, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Label', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * Creates a Label instance.
     * @name candystore.Label.create
     * @function
     * @returns {candystore.Label}
     */

    /**
     * The Label displays HTML encoded text.
     * @class
     * @extends shoeshine.Widget
     */
    candystore.Label = self
        .addMethods(/** @lends candystore.Label# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                /** @type {string} */
                this.labelText = undefined;

                this.setTagName('span');
            },

            /**
             * Sets text to display on label.
             * Displayed text will be HTML encoded.
             * @param {string} labelText
             * @returns {candystore.Label}
             */
            setLabelText: function (labelText) {
                $(this.getElement())
                    .html(labelText.toHtml());

                this.labelText = labelText;

                return this;
            },

            /** @ignore */
            contentMarkup: function () {
                return this.labelText.toHtml();
            }
        });
}, jQuery);
