/*global dessert, troop, sntls, jQuery, candystore */
troop.postpone(candystore, 'Popup', function (ns, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend(),
        $document = document && $(document);

    /**
     * The Popup trait allows widgets to be opened and closed like popups.
     * Popups maintain parent-children relationship with the widget that created them,
     * but they are rendered right under the body element. It is vital therefore that whatever happens inside
     * the popup must trigger widget events since they are the only way to notify the parent widget of changes.
     * Popups may be closed by clicking outside of the widget's DOM.
     * Expects to be added to Widget classes.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     */
    candystore.Popup = self
        .addConstants(/** @lends candystore.Popup */{
            /** @constant */
            EVENT_POPUP_OUTSIDE_CLICK: 'popup-outside-click',

            /** @constant */
            EVENT_POPUP_OPEN: 'popup-open',

            /** @constant */
            EVENT_POPUP_CLOSE: 'popup-close'
        })
        .addPrivateMethods(/** @lends candystore.Popup# */{
            /**
             * @param {boolean} a
             * @param {boolean} b
             * @returns {boolean}
             * @memberOf candystore.Popup
             * @private
             */
            _or: function (a, b) {
                return a || b;
            },

            /**
             * @param {jQuery} $element
             * @param {string} selector
             * @returns {boolean}
             * @memberOf candystore.Popup
             * @private
             */
            _hasClosest: function ($element, selector) {
                return $element.closest(selector).length > 0;
            },

            /** @private */
            _removeFromDom: function () {
                var element = this.getElement();
                if (element) {
                    $(element).remove();
                }
            },

            /**
             * @param {jQuery} $element
             * @returns {boolean}
             * @private
             */
            _isOutside: function ($element) {
                var element;
                if (this.outsideSelectors
                    .mapValues(this._hasClosest.bind(this, $element))
                    .getValues()
                    .reduce(this._or, false)
                    ) {
                    return true;
                } else if (this.insideSelectors
                    .mapValues(this._hasClosest.bind(this, $element))
                    .getValues()
                    .reduce(this._or, false)
                    ) {
                    return false;
                } else {
                    element = this.getElement();
                    return element && !$element.closest(element).length;
                }
            }
        })
        .addMethods(/** @lends candystore.Popup# */{
            /**
             * Call from host's init.
             */
            init: function () {
                this
                    .elevateMethod('onBodyClick')
                    .elevateMethod('onOutsideClick');

                /** @type {boolean} */
                this.isOpen = false;

                /** @type {sntls.Collection} */
                this.outsideSelectors = sntls.Collection.create();

                /** @type {sntls.Collection} */
                this.insideSelectors = sntls.Collection.create();
            },

            /**
             * Call from host class' afterAdd.
             */
            afterAdd: function () {
                this.subscribeTo(this.EVENT_POPUP_OUTSIDE_CLICK, this.onOutsideClick);
            },

            /**
             * Call from host class' afterRemove.
             */
            afterRemove: function () {
                this.unsubscribeFrom(this.EVENT_POPUP_OUTSIDE_CLICK);

                // removing DOM in case popup was removed via its parent with
                // which does not contain the DOM of the popup
                this._removeFromDom();

                // unsubscribing from global click event
                $document.off('click', this.onBodyClick);
            },

            /**
             * Call from host class' afterRender.
             */
            afterRender: function () {
                $document
                    .off('click', this.onBodyClick)
                    .on('click', this.onBodyClick);
            },

            /**
             * Opens popup. Popup must be added to a parent before calling this method.
             * @returns {candystore.Popup}
             */
            openPopup: function () {
                dessert.assert(this.parent, "Popup has no parent");

                if (!this.isOpen) {
                    this.renderInto(document.body);

                    this.isOpen = true;

                    this.triggerSync(this.EVENT_POPUP_OPEN);
                }

                return this;
            },

            /**
             * Closes popup, and removes it from the widget hierarchy.
             * @returns {candystore.Popup}
             */
            closePopup: function () {
                if (this.isOpen) {
                    // must set flag before triggering event
                    // otherwise event handlers would see mixed state
                    // (event says it's closed, but widget state says it's open)
                    this.isOpen = false;

                    // must trigger before removing widget from hierarchy
                    // otherwise event won't bubble
                    this.triggerSync(this.EVENT_POPUP_CLOSE);

                    this.removeFromParent();
                }
                return this;
            },

            /**
             * Treats DOM elements matching the specified global jQuery selector as inside of the popup.
             * Clicking on such elements would not trigger an 'outside-click' event even when they're outside of the
             * popup's DOM.
             * @param {string} globalSelector
             * @returns {candystore.Popup}
             */
            treatAsInside: function (globalSelector) {
                if (this.outsideSelectors.getItem(globalSelector)) {
                    this.outsideSelectors.deleteItem(globalSelector);
                }
                this.insideSelectors.setItem(globalSelector, globalSelector);
                return this;
            },

            /**
             * Treats DOM elements matching the specified global jQuery selector as outside of the popup.
             * Clicking on such elements would trigger an 'outside-click' event even when they're inside the popup's DOM.
             * @param {string} selector
             * @returns {candystore.Popup}
             */
            treatAsOutside: function (selector) {
                if (this.insideSelectors.getItem(selector)) {
                    this.insideSelectors.deleteItem(selector);
                }
                this.outsideSelectors.setItem(selector, selector);
                return this;
            },

            /**
             * Default outside click handler
             * @param {jQuery.Event} event
             * @ignore
             */
            onOutsideClick: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .closePopup()
                    .clearNextOriginalEvent();
            },

            /**
             * @param {UIEvent} event
             * @ignore
             */
            onBodyClick: function (event) {
                if (this._isOutside($(event.target))) {
                    this
                        .setNextOriginalEvent(event)
                        .triggerSync(this.EVENT_POPUP_OUTSIDE_CLICK)
                        .clearNextOriginalEvent();
                }
            }
        });
}, jQuery);
