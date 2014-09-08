/*global dessert, troop, sntls, jQuery, app */
troop.postpone(app.widgets, 'Popup', function (/**app.widgets*/widgets, className, /**jQuery*/$) {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * Popup trait.
     * Expects to be added to Widget host classes.
     * @class
     * @extends troop.Base
     * @extends shoeshine.Widget
     */
    app.widgets.Popup = self
        .addConstants(/** @lends app.widgets.Popup */{
            /** @constant */
            EVENT_POPUP_OUTSIDE_CLICK: 'popup-outside-click',

            /** @constant */
            EVENT_POPUP_OPEN: 'popup-open',

            /** @constant */
            EVENT_POPUP_CLOSE: 'popup-close'
        })
        .addPrivateMethods(/** @lends app.widgets.Popup# */{
            /**
             * @param {boolean} a
             * @param {boolean} b
             * @returns {boolean}
             * @memberOf app.widgets.Popup
             * @private
             */
            _or: function (a, b) {
                return a || b;
            },

            /**
             * @param {jQuery} $element
             * @param {string} selector
             * @returns {boolean}
             * @memberOf app.widgets.Popup
             * @private
             */
            _hasClosest: function ($element, selector) {
                return $element.closest(selector).length > 0;
            },

            /** @private */
            _removeFromDom: function () {
                var $element = $(this.getElement());
                if ($element.length) {
                    $element.remove();
                }
            },

            /**
             * @param {jQuery} $element
             * @returns {boolean}
             * @private
             */
            _isOutside: function ($element) {
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
                    return !$element.closest(this.getElement()).length;
                }
            },

            /**
             * @param {UIEvent} event
             * @private
             */
            _onBodyClick: function (event) {
                if (this._isOutside($(event.target))) {
                    this
                        .setNextOriginalEvent(event)
                        .triggerSync(this.EVENT_POPUP_OUTSIDE_CLICK)
                        .clearNextOriginalEvent();
                }
            }
        })
        .addMethods(/** @lends app.widgets.Popup# */{
            /**
             * Call from host's init.
             */
            init: function () {
                this
                    .elevateMethod('_onBodyClick')
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
                this._removeFromDom();
            },

            /**
             * Call from host class' afterRender.
             */
            afterRender: function () {
                $(document)
                    .off('click', this._onBodyClick)
                    .on('click', this._onBodyClick);
            },

            /** @returns {app.widgets.Popup} */
            openPopup: function () {
                dessert.assert(this.parent, "Popup has no parent");

                if (!this.isOpen) {
                    this.renderInto(document.body);

                    this.isOpen = true;

                    this.triggerSync(this.EVENT_POPUP_OPEN);
                }

                return this;
            },

            /** @returns {app.widgets.Popup} */
            closePopup: function () {
                if (this.isOpen) {
                    this.triggerSync(this.EVENT_POPUP_CLOSE);

                    this.removeFromParent();

                    this.isOpen = false;
                }
                return this;
            },

            /**
             * @param {string} globalSelector
             * @returns {app.widgets.Popup}
             */
            treatAsInside: function (globalSelector) {
                if (this.outsideSelectors.getItem(globalSelector)) {
                    this.outsideSelectors.deleteItem(globalSelector);
                }
                this.insideSelectors.setItem(globalSelector, globalSelector);
                return this;
            },

            /**
             * @param {string} selector
             * @returns {app.widgets.Popup}
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
             */
            onOutsideClick: function (event) {
                this
                    .setNextOriginalEvent(event)
                    .closePopup()
                    .clearNextOriginalEvent();
            }
        });
}, jQuery);
