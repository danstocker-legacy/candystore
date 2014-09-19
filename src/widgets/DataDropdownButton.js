/*global dessert, troop, sntls, evan, bookworm, shoeshine, candystore */
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
     * @extends candystore.EntityWidget
     */
    candystore.DataDropdownButton = self
        .addMethods(/** @lends candystore.DataDropdownButton# */{
            /**
             * @param {bookworm.FieldKey} selectedKey
             * @param {bookworm.FieldKey} optionsKey
             * @ignore
             */
            init: function (selectedKey, optionsKey) {
                dessert
                    .isFieldKey(selectedKey, "Invalid 'selected' field key")
                    .isFieldKey(optionsKey, "Invalid options field key");

                /**
                 * Field key that identifies the options
                 * @type {bookworm.FieldKey}
                 */
                this.optionsKey = optionsKey;

                candystore.EntityWidget.init.call(this, selectedKey);
                base.init.call(this);

                this.elevateMethod('onOptionSelect');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                this.subscribeTo(candystore.OptionList.EVENT_OPTION_SELECT, this.onOptionSelect);
            },

            /** @returns {candystore.DataLabel} */
            createLabelWidget: function () {
                return candystore.DataLabel.create(this.entityKey);
            },

            /** @returns {candystore.DataDropdown} */
            createDropdownWidget: function () {
                return candystore.DataDropdown.create(this.optionsKey);
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onOptionSelect: function (event) {
                var optionValue = event.payload.optionValue;

                bookworm.documents.setNextOriginalEvent(event);
                this.entityKey.toField().setValue(optionValue);
                bookworm.documents.clearNextOriginalEvent();
            }
        });
});
