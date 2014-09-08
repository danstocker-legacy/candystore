/*global dessert, troop, sntls, b$, s$, app */
troop.postpone(app.widgets, 'DataList', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = widgets.List,
        self = base.extend(className)
            .addTrait(b$.EntityBound)
            .addTrait(widgets.EntityWidget);

    /**
     * @name app.widgets.DataList.create
     * @function
     * @param {shoeshine.FieldKey} fieldKey Key to an ordered reference collection.
     * @returns {app.widgets.DataList}
     */

    /**
     * Data bound list of widgets.
     * Expects to be bound to an *ordered* collection.
     * Expects to have items that are also EntityWidgets.
     * @class
     * @extends app.widgets.List
     * @extends bookworm.EntityBound
     * @extends app.widgets.EntityWidget
     */
    app.widgets.DataList = self
        .addPrivateMethods(/** @lends app.widgets.DataList# */{
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
        .addMethods(/** @lends app.widgets.DataList# */{
            /**
             * @param {shoeshine.FieldKey} fieldKey
             * @ignore
             */
            init: function (fieldKey) {
                base.init.call(this);
                b$.EntityBound.init.call(this);
                widgets.EntityWidget.init.call(this, fieldKey);
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
                return widgets.DataLabel.create(itemKey)
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
