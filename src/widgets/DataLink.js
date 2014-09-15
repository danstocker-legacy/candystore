/*global dessert, troop, sntls, bookworm, shoeshine, candystore */
troop.postpone(candystore, 'DataLink', function (ns, className) {
    "use strict";

    var base = candystore.Link,
        self = base.extend(className)
            .addTrait(bookworm.EntityBound)
            .addTrait(candystore.EntityWidget)
            .addTraitAndExtend(candystore.FieldBound);

    /**
     * Creates a DataLink instance.
     * @name candystore.DataLink.create
     * @function
     * @param {bookworm.FieldKey} urlKey Points to the link's URL.
     * @param {bookworm.FieldKey} textKey Points to the link's text.
     * @returns {candystore.DataLink}
     */

    /**
     * The DataLink displays a link based on the value of a field in the cache.
     * Keeps the target URL in sync with the changes of the corresponding field.
     * This is a general implementation with independent fields for URL and text.
     * For data links where the two fields are connected (eg. by being in the same document)
     * it might be a better idea to subclass Link directly than using DataLink.
     * @class
     * @extends candystore.Link
     */
    candystore.DataLink = self
        .addMethods(/** @lends candystore.DataLink# */{
            /**
             * @param {bookworm.FieldKey} urlKey
             * @param {bookworm.FieldKey} textKey
             * @ignore
             */
            init: function (urlKey, textKey) {
                dessert
                    .isFieldKey(urlKey, "Invalid URL field key")
                    .isFieldKey(textKey, "Invalid text field key");

                /**
                 * Field key that identifies the text
                 * @type {bookworm.FieldKey}
                 */
                this.textKey = textKey;

                base.init.call(this);
                bookworm.EntityBound.init.call(this);
                candystore.EntityWidget.init.call(this, urlKey);
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
             * Creates default data bound Label widget based on the textKey provided at instantiation.
             * Override to specify custom widget.
             * @returns {candystore.DataLabel}
             */
            createLabelWidget: function () {
                return candystore.DataLabel.create(this.textKey);
            },

            /**
             * @param {string} fieldValue
             * @returns {candystore.DataLink}
             * @ignore
             */
            setFieldValue: function (fieldValue) {
                this.setTargetUrl(fieldValue);
                return this;
            }
        });
});
