/*global dessert, troop, sntls, shoeshine, poodle, jQuery, candystore */
troop.postpone(candystore, 'DynamicImage', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = candystore.Image,
        self = base.extend(className);

    /**
     * @name candystore.DynamicImage.create
     * @function
     * @returns {candystore.DynamicImage}
     */

    /**
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
            init: function () {
                base.init.call(this);

                this
                    .setTagName('div')
                    .elevateMethod('onImageLoadStart')
                    .elevateMethod('onImageLoadSuccess')
                    .elevateMethod('onImageLoadFailure');

                /** @type {HTMLImageElement} */
                this.imageElement = undefined;

                /** @type {poodle.Image} */
                this.image = undefined;
            },

            /** @ignore */
            afterRender: function () {
                base.afterRender.call(this);
                this._updateImageElement();
            },

            /**
             * @param {poodle.ImageUrl} imageUrl
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
                this
                    .setNextOriginalEvent(event)
                    .triggerSync(this.EVENT_IMAGE_LOAD_START)
                    .clearNextOriginalEvent();
            },

            /**
             * @param {poodle.ImageEvent} event
             * @ignore
             */
            onImageLoadSuccess: function (event) {
                this._setImageElement(event.imageElement);

                this
                    .setNextOriginalEvent(event)
                    .triggerSync(this.EVENT_IMAGE_LOAD_SUCCESS)
                    .clearNextOriginalEvent();
            },

            /**
             * @param {poodle.ImageEvent} event
             * @ignore
             */
            onImageLoadFailure: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .triggerSync(this.EVENT_IMAGE_LOAD_FAILURE)
                    .clearNextOriginalEvent();
            }
        });
}, jQuery);
