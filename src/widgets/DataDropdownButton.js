/*global dessert, troop, sntls, evan, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataDropdownButton', function (ns, className) {
    "use strict";

    var base = candystore.DropdownButton,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
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
        .addPrivateMethods(/** @lends candystore.DataDropdownButton# */{
            /** @private */
            _updateSelectedOption: function () {
                var optionValue = this.entityKey.toField().getValue(),
                    optionWidget = this.dropdown.getListWidget().getOptionByValue(optionValue),
                    dropdownWidget = this.getDropdownWidget();

                if (optionWidget && dropdownWidget) {
                    dropdownWidget.getListWidget()
                        .selectOption(optionWidget.childName);
                }
            }
        })
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
                bookworm.EntityBound.init.call(this);

                this
                    .elevateMethod('onOptionSelect')
                    .elevateMethod('onListItemsChange');
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);

                this._updateSelectedOption();

                this
                    .bindToEntityNodeChange(this.entityKey, 'onSelectedChange')
                    .subscribeTo(candystore.DataList.EVENT_LIST_ITEMS_CHANGE, this.onListItemsChange)
                    .subscribeTo(candystore.OptionList.EVENT_OPTION_SELECT, this.onOptionSelect);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindAll();
            },

            /** @returns {candystore.DataLabel} */
            spawnLabelWidget: function () {
                return candystore.DataLabel.create(this.entityKey);
            },

            /** @returns {candystore.DataDropdown} */
            spawnDropdownWidget: function () {
                return candystore.DataDropdown.create(this.optionsKey);
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onSelectedChange: function (event) {
                evan.eventPropertyStack.pushOriginalEvent(event);
                this._updateSelectedOption();
                evan.eventPropertyStack.popOriginalEvent();
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onListItemsChange: function (event) {
                evan.eventPropertyStack.pushOriginalEvent(event);
                this._updateSelectedOption();
                evan.eventPropertyStack.popOriginalEvent();
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onOptionSelect: function (event) {
                var optionValue = event.payload.optionValue;

                evan.eventPropertyStack.pushOriginalEvent(event);
                this.entityKey.toField()
                    .setValue(optionValue);
                evan.eventPropertyStack.popOriginalEvent();
            }
        });
});
