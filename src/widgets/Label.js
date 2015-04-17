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
     * Displays text, optionally HTML escaped, based on a string literal or stringifiable object.
     * @class
     * @extends shoeshine.Widget
     */
    candystore.Label = self
        .addPrivateMethods(/** @lends candystore.Label# */{
            /**
             * Updates Label's CSS classes based on its content.
             * @private
             */
            _updateLabelStyle: function () {
                if (this.labelText) {
                    this
                        .removeCssClass('no-text')
                        .addCssClass('has-text');
                } else {
                    this
                        .removeCssClass('has-text')
                        .addCssClass('no-text');
                }
            },

            /**
             * @returns {string}
             * @private
             */
            _getCurrentLabelText: function () {
                var labelText = this.labelText;
                if (typeof labelText === 'string' || labelText instanceof String) {
                    // label text is genuine string
                    return labelText;
                } else if (labelText instanceof Object) {
                    // label text is not string but can be stringified
                    return labelText.toString();
                } else {
                    // everything else (mostly undefined & null)
                    return '';
                }
            },

            /** @private */
            _updateLabelDom: function () {
                var element = this.getElement(),
                    currentLabelText;

                if (element) {
                    currentLabelText = this._getCurrentLabelText();
                    $(element).html(this.htmlEscaped ?
                        currentLabelText.toHtml() :
                        currentLabelText);
                }
            }
        })
        .addMethods(/** @lends candystore.Label# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                /**
                 * Text or text provider associated with Label.
                 * @type {string|object}
                 */
                this.labelText = undefined;

                /**
                 * Whether label HTML escapes text before rendering.
                 * @type {boolean}
                 */
                this.htmlEscaped = true;

                this.setTagName('span');

                this._updateLabelStyle();
            },

            /** @ignore */
            contentMarkup: function () {
                var currentLabelText = this._getCurrentLabelText();
                return this.htmlEscaped ?
                    currentLabelText.toHtml() :
                    currentLabelText;
            },

            /**
             * Sets flag that determines whether label will HTML escape text before rendering.
             * Use with care: script embedded in labelText might compromise security!
             * @param {boolean} htmlEscaped
             * @returns {candystore.Label}
             */
            setHtmlEscaped: function (htmlEscaped) {
                this.htmlEscaped = htmlEscaped;
                this._updateLabelDom();
                return this;
            },

            /**
             * Sets text to display on label. Accepts strings or objects that implement .toString().
             * Displayed text will be HTML encoded.
             * @param {string|object} labelText
             * @returns {candystore.Label}
             */
            setLabelText: function (labelText) {
                this.labelText = labelText;
                this._updateLabelDom();
                this._updateLabelStyle();
                return this;
            }
        });
}, jQuery);
