/*global dessert, troop, sntls, b$, s$, app */
troop.postpone(app.widgets, 'DataDropdown', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = widgets.Dropdown,
        self = base.extend(className)
            .addTrait(widgets.EntityWidget);

    /**
     * @name app.widgets.DataDropdown.create
     * @function
     * @param {bookworm.FieldKey} fieldKey
     * @returns {app.widgets.DataDropdown}
     */

    /**
     * @class
     * @extends app.widgets.Dropdown
     * @extends app.widgets.EntityWidget
     */
    app.widgets.DataDropdown = self
        .addMethods(/** @lends app.widgets.DataDropdown# */{
            /**
             * @param {bookworm.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                widgets.EntityWidget.init.call(this, fieldKey);
                base.init.call(this);
            },

            /** @returns {app.widgets.DataList} */
            createListWidget: function () {
                return widgets.DataList.create(this.entityKey);
            }
        });
});
