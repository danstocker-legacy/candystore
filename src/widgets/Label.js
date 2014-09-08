/*global dessert, troop, sntls, e$, s$, jQuery, app */
troop.postpone(app.widgets, 'Label', function (/**app.widgets*/widgets, className, /**jQuery*/$) {
    "use strict";

    var base = s$.Widget,
        self = base.extend(className);

    /**
     * @name app.widgets.Label.create
     * @function
     * @returns {app.widgets.Label}
     */

    /**
     * @class
     * @extends shoeshine.Widget
     */
    app.widgets.Label = self
        .addMethods(/** @lends app.widgets.Label# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                /** @type {string} */
                this.labelText = undefined;

                this.setTagName('span');
            },

            /**
             * @param {string} labelText
             * @returns {app.widgets.Label}
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
