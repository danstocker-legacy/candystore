/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataList', function (ns, className) {
    "use strict";

    var base = candystore.List,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget)
            .addTraitAndExtend(candystore.FieldBound);

    /**
     * Creates a DataList instance.
     * @name candystore.DataList.create
     * @function
     * @param {bookworm.FieldKey} fieldKey Key to an ordered reference collection.
     * @returns {candystore.DataList}
     */

    /**
     * The DataList maintains a list of widgets based on a collection field in the cache.
     * Keeps list in sync with the changes of the corresponding collection.
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
             * @param {bookworm.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                dessert.isFieldKey(fieldKey, "Invalid field key");

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
             * Creates item widget for the specified item key.
             * To specify a custom widget class, either override this method in a subclass, or provide
             * a surrogate definition on DataLabel, in case the custom item widget is also DataLabel-based.
             * Expected to set child name on the returned widget (and thus determining its position within the list).
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
             * @ignore
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

                this.triggerSync(this.EVENT_LIST_ITEMS_CHANGE, {
                    itemsRemoved: itemsToRemove,
                    itemsAdded  : itemsToAdd
                });

                return this;
            }
        });
});
