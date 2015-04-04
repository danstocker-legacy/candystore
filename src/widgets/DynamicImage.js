/*global dessert, troop, sntls, evan, shoeshine, poodle, jQuery, candystore */
troop.postpone(candystore, 'DynamicImage', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = candystore.Image,
        self = base.extend(className);

    /**
     * Creates a DynamicImage instance.
     * @name candystore.DynamicImage.create
     * @function
     * @returns {candystore.DynamicImage}
     */

    /**
     * The DynamicImage is an Image that loads images dynamically, and triggers appropriate events
     * at relevant stages of the loading process. No longer is an <em>img</em> tag in itself, but wraps
     * an image tag that may or may not be present, depending on loading success. The image will not load sooner than
     * the widget is rendered.
     * @class
     * @extends candystore.Image
     */
    candystore.DynamicImage = self
        .addConstants(/** @lends candystore.DynamicImage */{
            /** @constant */
            EVENT_IMAGE_LOAD_START: 'image-load-start',

            /** @constant */
            EVENT_IMAGE_LOAD_SUCCESS: 'image-load-success',

            /** @constant */
            EVENT_IMAGE_LOAD_FAILURE: 'image-load-failure'
        })
        .addPrivateMethods(/** @lends candystore.DynamicImage# */{
            /** @private */
            _updateImageElement: function () {
                var element = this.getElement(),
                    oldImageElement,
                    newImageElement;

                if (element) {
                    oldImageElement = $(element).children('img');
                    newImageElement = this.imageElement;

                    if (oldImageElement.length) {
                        oldImageElement.replaceWith(newImageElement);
                    } else {
                        $(element).append(newImageElement);
                    }
                }
            },

            /**
             * @param {HTMLImageElement} imageElement
             * @private
             */
            _setImageElement: function (imageElement) {
                this.imageElement = imageElement;
                this._updateImageElement();
            }
        })
        .addMethods(/** @lends candystore.DynamicImage# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                this
                    .setTagName('div')
                    .elevateMethod('onImageLoadStart')
                    .elevateMethod('onImageLoadSuccess')
                    .elevateMethod('onImageLoadFailure');

                /**
                 * HTML image element associated with Image widget.
                 * @type {HTMLImageElement}
                 */
                this.imageElement = undefined;

                /**
                 * Transport-level Image instance associated with Image widget.
                 * @type {poodle.Image}
                 */
                this.image = undefined;
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                this._updateImageElement();
            },

            /**
             * Sets image URL. Initiates loading of image when necessary, and subscribes widget
             * to image loading events on the specified URL.
             * @param {poodle.ImageUrl} imageUrl ImageUrl instance.
             * @returns {candystore.DynamicImage}
             */
            setImageUrl: function (imageUrl) {
                dessert.isLocation(imageUrl, "Invalid image URL");

                var Image = poodle.Image,
                    oldImageUrl = this.imageUrl;

                if (!imageUrl.equals(oldImageUrl)) {
                    if (oldImageUrl) {
                        oldImageUrl
                            .unsubscribeFrom(Image.EVENT_IMAGE_LOAD_START, this.onImageLoadStart)
                            .unsubscribeFrom(Image.EVENT_IMAGE_LOAD_SUCCESS, this.onImageLoadSuccess)
                            .unsubscribeFrom(Image.EVENT_IMAGE_LOAD_FAILURE, this.onImageLoadFailure);
                    }

                    imageUrl
                        .subscribeTo(Image.EVENT_IMAGE_LOAD_START, this.onImageLoadStart)
                        .subscribeTo(Image.EVENT_IMAGE_LOAD_SUCCESS, this.onImageLoadSuccess)
                        .subscribeTo(Image.EVENT_IMAGE_LOAD_FAILURE, this.onImageLoadFailure);

                    this.imageUrl = imageUrl;

                    this.image = imageUrl.toImage()
                        .loadImage();
                }

                return this;
            },

            /**
             * @param {poodle.ImageEvent} event
             * @ignore
             */
            onImageLoadStart: function (event) {
                var link = evan.pushOriginalEvent(event);
                this.triggerSync(this.EVENT_IMAGE_LOAD_START);
                link.unLink();
            },

            /**
             * @param {poodle.ImageEvent} event
             * @ignore
             */
            onImageLoadSuccess: function (event) {
                var link = evan.pushOriginalEvent(event);
                this._setImageElement(event.imageElement);
                this.triggerSync(this.EVENT_IMAGE_LOAD_SUCCESS);
                link.unLink();
            },

            /**
             * @param {poodle.ImageEvent} event
             * @ignore
             */
            onImageLoadFailure: function (event) {
                var link = evan.pushOriginalEvent(event);
                this.triggerSync(this.EVENT_IMAGE_LOAD_FAILURE);
                link.unLink();
            }
        });
}, jQuery);
