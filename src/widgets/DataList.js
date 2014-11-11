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
     * TODO: Add unit tests.
     * @class
     * @extends candystore.List
     * @extends bookworm.EntityBound
     * @extends candystore.EntityWidget
     * @extends candystore.FieldBound
     */
    candystore.DataList = self
        .addPrivateMethods(/** @lends candystore.DataList# */{
            /**
             * @param {bookworm.ItemKey} itemKey
             * @private
             */
            _addItem: function (itemKey) {
                var oldChildName = this.childNamesByItemKey.getItem(itemKey.toString()),
                    newChildName = this.getChildNameByKey(itemKey),
                    oldItemKey;

                if (oldChildName) {
                    // renaming existing item widget
                    this.getChild(oldChildName).setChildName(newChildName);

                    // cleaning up lookups
                    oldItemKey = this.itemKeysByChildName.getItem(newChildName);
                    this.itemKeysByChildName.deleteItem(oldChildName);
                    this.childNamesByItemKey.deleteItem(oldItemKey.toString());
                } else {
                    // adding new item widget
                    this.addItemWidget(this.createItemWidget(itemKey).setChildName(newChildName));
                }

                this.itemKeysByChildName.setItem(newChildName, itemKey);
                this.childNamesByItemKey.setItem(itemKey.toString(), newChildName);
            },

            /**
             * @param {bookworm.ItemKey} itemKey
             * @private
             */
            _removeItem: function (itemKey) {
                var childName = this.childNamesByItemKey.getItem(itemKey.toString());
                if (childName) {
                    this.childNamesByItemKey.deleteItem(itemKey.toString());
                    this.itemKeysByChildName.deleteItem(childName);
                    this.getChild(childName).removeFromParent();
                }
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             * @private
             */
            _onItemChange: function (event) {
                var fieldPath = this.entityKey.getEntityPath().asArray,
                    itemQuery = fieldPath.concat('|'.toKVP()).toQuery(),
                    itemKey;

                if (itemQuery.matchesPath(event.originalPath)) {
                    // TODO: Revisit after entity path to entity key conversion is resolved.
                    itemKey = event.originalPath.clone().trimLeft().asArray.toItemKey();

                    if (event.beforeValue !== undefined && event.afterValue === undefined) {
                        // item was removed
                        this._removeItem(itemKey);
                    } else if (event.afterValue !== undefined) {
                        // item was added
                        this._addItem(itemKey);
                    }
                }
            }
        })
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

                /**
                 * Lookup associating item keys with widget (child) names.
                 * @type {sntls.Collection}
                 */
                this.childNamesByItemKey = sntls.Collection.create();

                /**
                 * Lookup associating widget (child) names with item keys.
                 * @type {sntls.Collection}
                 */
                this.itemKeysByChildName = sntls.Collection.create();
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                candystore.FieldBound.afterAdd.call(this);
                this.bindToEntityChange(this.entityKey, '_onItemChange');
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
                    .setChildName(this.getChildNameByKey(itemKey));
            },

            /**
             * Retrieves the item childName associated with the specified itemKey. (Child name determines order.)
             * To specify custom child name for item widgets, override this method.
             * @param {bookworm.ItemKey} itemKey
             * @returns {string}
             */
            getChildNameByKey: function (itemKey) {
                return itemKey.itemId;
            },

            /**
             * Fetches item widget by item key.
             * @param {bookworm.ItemKey} itemKey
             * @returns {shoeshine.Widget}
             */
            getItemWidgetByKey: function (itemKey) {
                var childName = this.childNamesByItemKey.getItem(itemKey.toString());
                return this.getChild(childName);
            },

            /**
             * @param {object} fieldValue
             * @returns {candystore.DataList}
             * @ignore
             */
            setFieldValue: function (fieldValue) {
                var that = this,
                    fieldKey = this.entityKey,
                    itemsBefore = this.itemKeysByChildName.toSet(),
                    itemsAfter = sntls.Collection.create(fieldValue)
                        .mapValues(function (itemValue, itemId) {
                            return fieldKey.getItemKey(itemId);
                        })
                        .mapKeys(function (itemKey) {
                            return that.getChildNameByKey(itemKey);
                        })
                        .toSet(),
                    itemsToRemove = itemsBefore.subtract(itemsAfter),
                    itemsToAdd = itemsAfter.subtract(itemsBefore);

                // removing tiles that are no longer on the page
                itemsToRemove.toCollection()
                    .passEachItemTo(this._removeItem, this);

                // revealing new tiles
                itemsToAdd.toCollection()
                    .passEachItemTo(this._addItem, this);

                this.triggerSync(this.EVENT_LIST_ITEMS_CHANGE, {
                    itemsRemoved: itemsToRemove,
                    itemsAdded  : itemsToAdd
                });

                return this;
            }
        });
});
