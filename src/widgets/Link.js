/*global dessert, troop, sntls, shoeshine, jQuery, candystore */
troop.postpone(candystore, 'Link', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = shoeshine.Widget,
        self = base.extend(className);

    /**
     * Creates a Link instance.
     * @name candystore.Link.create
     * @function
     * @returns {candystore.Link}
     */

    /**
     * The Link implements a basic hyperlink.
     * @class
     * @extends shoeshine.Widget
     */
    candystore.Link = self
        .addMethods(/** @lends candystore.Link# */{
            /** @ignore */
            init: function () {
                base.init.call(this);
                this.setTagName('a');

                this.spawnLabelWidget()
                    .setChildName('link-label')
                    .addToParent(this);
            },

            /**
             * Creates Label widget to be used inside the link.
             * Override to specify custom widget.
             * @returns {candystore.Label}
             */
            spawnLabelWidget: function () {
                return candystore.Label.create();
            },

            /**
             * Retrieves the label widget contained within the link.
             * @returns {candystore.Label}
             */
            getLabelWidget: function () {
                return this.getChild('link-label');
            },

            /**
             * Sets URL for the link.
             * @returns {candystore.Link}
             */
            setTargetUrl: function (targetUrl) {
                dessert.isString(targetUrl, "Invalid target URL");

                var element = this.getElement();
                if (element) {
                    $(element).attr('href', targetUrl);
                }

                this.addAttribute('href', targetUrl);

                return this;
            },

            /**
             * Sets the link's caption.
             * Expects the caption widget to be a Label.
             * Override when caption widget is something other than Label.
             * @param {string} caption
             * @returns {candystore.Link}
             */
            setCaption: function (caption) {
                this.getLabelWidget()
                    .setLabelText(caption);
                return this;
            }
        });
}, jQuery);
