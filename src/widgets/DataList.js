/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataList', function (ns, className) {
    "use strict";

    var base = candystore.List,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget);

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
     * @class
     * @extends candystore.List
     * @extends bookworm.EntityBound
     * @extends candystore.EntityWidget
     */
    candystore.DataList = self
        .addPrivateMethods(/** @lends candystore.DataList# */{
            /**
             * Updates list items.
             * Removes items that are no longer part of the list, and adds new ones.
             * @private
             */
            _updateItems: function () {
                var that = this,
                    fieldKey = this.entityKey,
                    collectionField = this.entityKey.toField(),
                    itemsBefore = this.children.toSet(),
                    itemsAfter = collectionField
                        .getItemsAsCollection()
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
            }
        })
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

            /**
             * TODO: handle single item changes
             * @ignore
             */
            afterAdd: function () {
                base.afterAdd.call(this);
                this._updateItems();
                this
                    .bindToEntityNodeChange(this.entityKey, 'onFieldReplace')
                    .bindToEntityNodeChange(this.entityKey.documentKey, 'onDocumentReplace');
            },

            /** @ignore */
            afterRemove: function () {
                base.afterRemove.call(this);
                this.unbindAll();
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

            /** @ignore */
            onFieldReplace: function () {
                this._updateItems();
            },

            /** @ignore */
            onDocumentReplace: function () {
                this._updateItems();
            }
        });
});
