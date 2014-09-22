/*global dessert, troop, sntls, evan, shoeshine, jQuery, candystore */
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
        .addPrivateMethods(/** @lends candystore.Label# */{
            /** @private */
            _updateContentStyle: function () {
                if (this.labelText) {
                    this
                        .removeCssClass('no-text')
                        .addCssClass('has-text');
                } else {
                    this
                        .removeCssClass('has-text')
                        .addCssClass('no-text');
                }
            }
        })
        .addMethods(/** @lends candystore.Label# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                /** @type {string} */
                this.labelText = undefined;

                this.setTagName('span');

                this._updateContentStyle();
            },

            /**
             * Sets text to display on label.
             * Displayed text will be HTML encoded.
             * @param {string} labelText
             * @returns {candystore.Label}
             */
            setLabelText: function (labelText) {
                dessert.isStringOptional(labelText, "Invalid label text");

                $(this.getElement())
                    .html(labelText ? labelText.toHtml() : '');

                this.labelText = labelText;

                this._updateContentStyle();

                return this;
            },

            /** @ignore */
            contentMarkup: function () {
                var labelText = this.labelText;
                return labelText ? labelText.toHtml() : '';
            }
        });
}, jQuery);
