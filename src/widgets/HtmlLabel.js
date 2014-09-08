/*global dessert, troop, sntls, s$, jQuery, app */
troop.postpone(app.widgets, 'HtmlLabel', function (/**app.widgets*/widgets, className, /**jQuery*/$) {
    "use strict";

    var base = widgets.Label,
        self = base.extend(className);

    /**
     * @name app.widgets.HtmlLabel.create
     * @function
     * @returns {app.widgets.HtmlLabel}
     */

    /**
     * @class
     * @extends app.widgets.Label
     */
    app.widgets.HtmlLabel = self
        .addMethods(/** @lends app.widgets.HtmlLabel# */{
            /**
             * @param {string} labelText
             * @returns {app.widgets.Label}
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
