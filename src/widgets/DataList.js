/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataList', function (ns, className) {
    "use strict";

    var base = candystore.List,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget)
            .addTraitAndExtend(candystore.FieldBound);

    /**
     * @name candystore.DataList.create
     * @function
     * @param {shoeshine.FieldKey} fieldKey Key to an ordered reference collection.
     * @returns {candystore.DataList}
     */

    /**
     * Data bound list of widgets.
     * Expects to be bound to an *ordered* collection.
     * Expects to have items that are also EntityWidgets.
     * TODO: handle single item changes, perhaps with a modified FieldBound
     * @class
     * @extends candystore.List
     * @extends bookworm.EntityBound
     * @extends candystore.EntityWidget
     * @extends candystore.FieldBound
     */
    candystore.DataList = self
        .addMethods(/** @lends candystore.DataList# */{
            /**
             * @param {shoeshine.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                base.init.call(this);
                bookworm.EntityBound.init.call(this);
                candystore.EntityWidget.init.call(this, fieldKey);
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                candystore.FieldBound.afterAdd.call(this);
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                candystore.FieldBound.afterRemove.call(this);
            },

            /**
             * Override method to specify list item widget.
             * Expected to set child name on the returned widget that determines its order within the list.
             * @param {bookworm.ItemKey} itemKey
             * @returns {shoeshine.Widget}
             */
            createItemWidget: function (itemKey) {
                return candystore.DataLabel.create(itemKey)
                    .setChildName(itemKey.itemId);
            },

            /**
             * @param {object} fieldValue
             * @returns {candystore.DataList}
             */
            setFieldValue: function (fieldValue) {
                var that = this,
                    fieldKey = this.entityKey,
                    itemsBefore = this.children.toSet(),
                    itemsAfter = sntls.Collection.create(fieldValue)
                        .mapValues(function (itemOrder, itemId) {
                            return that.createItemWidget(fieldKey.getItemKey(itemId))
                                .setTagName('li');
                        })
                        .mapKeys(function (/**shoeshine.Widget*/itemWidget) {
                            return itemWidget.childName;
                        })
                        .toSet(),
                    itemsToRemove = itemsBefore.subtract(itemsAfter),
                    itemsToAdd = itemsAfter.subtract(itemsBefore);

                // removing tiles that are no longer on the page
                itemsToRemove.toWidgetCollection()
                    .removeFromParent();

                // revealing new tiles
                itemsToAdd.toWidgetCollection()
                    .passEachItemTo(this.addItemWidget, this);

                return this;
            }
        });
});
