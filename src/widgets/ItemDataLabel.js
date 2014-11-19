/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'ItemDataLabel', function (ns, className) {
    "use strict";

    var base = candystore.DataLabel;

    /**
     * Creates a ItemDataLabel instance.
     * @name candystore.ItemDataLabel.create
     * @function
     * @param {bookworm.FieldKey} textFieldKey Identifies field to be displayed.
     * @param {bookworm.ItemKey} itemKey Identifies item the widget is associated with.
     * @returns {candystore.ItemDataLabel}
     */

    /**
     * General DataLabel to be used as a list item.
     * @class
     * @extends candystore.DataLabel
     * @extends candystore.DataListItem
     */
    candystore.ItemDataLabel = base.extend(className)
        .addTrait(candystore.DataListItem);
});
