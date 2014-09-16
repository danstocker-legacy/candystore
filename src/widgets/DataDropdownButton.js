/*global dessert, troop, sntls, evan, shoeshine, candystore */
troop.postpone(candystore, 'DataDropdownButton', function (ns, className) {
    "use strict";

    var base = candystore.DropdownButton,
        self = base.extend(className)
            .addTrait(candystore.EntityWidget);

    /**
     * @name candystore.DataDropdownButton.create
     * @function
     * @param {bookworm.FieldKey} labelKey
     * @param {bookworm.FieldKey} optionsKey
     * @returns {candystore.DataDropdownButton}
     */

    /**
     * TODO: Add documentation
     * @class
     * @extends candystore.DropdownButton
     */
    candystore.DataDropdownButton = self
        .addMethods(/** @lends candystore.DataDropdownButton# */{
            /**
             * @param {bookworm.FieldKey} labelKey
             * @param {bookworm.FieldKey} optionsKey
             * @ignore
             */
            init: function (labelKey, optionsKey) {
                dessert
                    .isFieldKey(labelKey, "Invalid label field key")
                    .isFieldKey(optionsKey, "Invalid options field key");

                /**
                 * Field key that identifies the options
                 * @type {bookworm.FieldKey}
                 */
                this.optionsKey = optionsKey;

                candystore.EntityWidget.init.call(this, labelKey);
                base.init.call(this);
            },

            /** @returns {candystore.DataLabel} */
            createLabelWidget: function () {
                return candystore.DataLabel.create(this.entityKey);
            },

            /** @returns {candystore.DataDropdown} */
            createDropdownWidget: function () {
                return candystore.DataDropdown.create(this.optionsKey);
            }
        });
});
