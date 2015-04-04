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
             * @param {string} childName
             * @param {bookworm.ItemKey} itemKey
             * @private
             * @memberOf candystore.DataList
             */
            _getSetKey: function (childName, itemKey) {
                return childName + '|' + itemKey.toString();
            },

            /**
             * @param {bookworm.ItemKey} itemKey
             * @returns {shoeshine.Widget}
             * @private
             */
            _spawnPreparedItemWidget: function (itemKey) {
                return this.spawnItemWidget(itemKey)
                    .setItemKey(itemKey)
                    .setChildName(this.spawnItemName(itemKey));
            },

            /**
             * @param {bookworm.ItemKey} itemKey
             * @private
             */
            _addItem: function (itemKey) {
                var oldChildName = this.childNamesByItemKey.getItem(itemKey.toString());

                if (oldChildName) {
                    // renaming existing item widget
                    this.getChild(oldChildName)
                        .setChildName(this.spawnItemName(itemKey));
                } else {
                    // adding new item widget
                    this.addItemWidget(this._spawnPreparedItemWidget(itemKey));
                }
            },

            /**
             * @param {bookworm.ItemKey} itemKey
             * @private
             */
            _removeItem: function (itemKey) {
                var childName = this.childNamesByItemKey.getItem(itemKey.toString());
                if (childName) {
                    this.getChild(childName).removeFromParent();
                }
            },

            /** @private */
            _initChildLookup: function () {
                this.childNamesByItemKey = this.children
                    .mapKeys(function (childWidget) {
                        return childWidget.itemKey.toString();
                    })
                    .mapValues(function (childWidget) {
                        return childWidget.childName;
                    });
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

                this
                    .elevateMethod('onChildAdd')
                    .elevateMethod('onChildRemove');

                /**
                 * Lookup associating item keys with widget (child) names.
                 * @type {sntls.Collection}
                 */
                this.childNamesByItemKey = sntls.Collection.create();
            },

            /** @ignore */
            afterAdd: function () {
                base.afterAdd.call(this);
                candystore.FieldBound.afterAdd.call(this);

                this._initChildLookup();

                this
                    .subscribeTo(this.EVENT_CHILD_ADD, this.onChildAdd)
                    .subscribeTo(this.EVENT_CHILD_REMOVE, this.onChildRemove)
                    .bindToEntityChange(this.entityKey, 'onItemChange');
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
             * @param {bookworm.ItemKey} itemKey
             * @returns {shoeshine.Widget}
             */
            spawnItemWidget: function (itemKey) {
                return candystore.ItemDataLabel.create(itemKey, itemKey)
                    .setChildName(this.spawnItemName(itemKey));
            },

            /**
             * Retrieves the item childName associated with the specified itemKey. (Child name determines order.)
             * To specify custom child name for item widgets, override this method.
             * @param {bookworm.ItemKey} itemKey
             * @returns {string}
             */
            spawnItemName: function (itemKey) {
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
                    itemsWidgetsBefore = this.children
                        .mapKeys(function (itemWidget, childName) {
                            return that._getSetKey(childName, itemWidget.itemKey);
                        })
                        .toSet(),
                    itemsKeysAfter = sntls.Collection.create(fieldValue)
                        .mapValues(function (itemValue, itemId) {
                            return fieldKey.getItemKey(itemId);
                        })
                        .mapKeys(function (itemKey) {
                            return that._getSetKey(that.spawnItemName(itemKey), itemKey);
                        })
                        .toSet(),
                    itemWidgetsToRemove = itemsWidgetsBefore.subtract(itemsKeysAfter)
                        .toWidgetCollection(),
                    itemKeysToAdd = itemsKeysAfter.subtract(itemsWidgetsBefore),
                    itemWidgetsToAdd = itemKeysToAdd
                        .toCollection()
                        .mapValues(function (itemKey) {
                            return that._spawnPreparedItemWidget(itemKey);
                        });

                // removing tiles that are no longer on the page
                itemWidgetsToRemove
                    .removeFromParent();

                // revealing new tiles
                itemWidgetsToAdd
                    .passEachItemTo(this.addItemWidget, this);

                this.spawnEvent(this.EVENT_LIST_ITEMS_CHANGE)
                    .setPayloadItems({
                        itemsRemoved: itemWidgetsToRemove,
                        itemsAdded  : itemWidgetsToAdd
                    })
                    .triggerSync();

                return this;
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onChildAdd: function (event) {
                var childWidget;

                if (event.senderWidget === this) {
                    childWidget = event.payload.childWidget;

                    // when child is already associated with an item key
                    this.childNamesByItemKey
                        .setItem(childWidget.itemKey.toString(), childWidget.childName);
                }
            },

            /**
             * @param {shoeshine.WidgetEvent} event
             * @ignore
             */
            onChildRemove: function (event) {
                var childWidget;

                if (event.senderWidget === this) {
                    childWidget = event.payload.childWidget;

                    // updating lookup buffers
                    this.childNamesByItemKey
                        .deleteItem(childWidget.itemKey.toString());
                }
            },

            /**
             * @param {flock.ChangeEvent} event
             * @ignore
             */
            onItemChange: function (event) {
                var fieldPath = this.entityKey.getEntityPath().asArray,
                    itemQuery = fieldPath.concat(['|'.toKVP(), '\\'.toKVP()]).toQuery(),
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
        });
});
