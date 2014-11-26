/*global dessert, troop, sntls, candystore */
troop.postpone(candystore, 'Expandable', function () {
    "use strict";

    var base = troop.Base,
        self = base.extend();

    /**
     * @class
     * @extends troop.Base
     * @extends shoeshine.BinaryStateful
     * @extends shoeshine.Widget
     */
    candystore.Expandable = self
        .addConstants(/** @lends candystore.Expandable */{
            /** @constant */
            STATE_NAME_EXPANDABLE: 'state-expandable',

            /** @constants */
            EVENT_EXPAND: 'expand',

            /** @constants */
            EVENT_RETRACT: 'retract'
        })
        .addPrivateMethods(/** @lends candystore.Expandable# */{
            /** @private */
            _updateExpandedState: function () {
                if (this.isStateOn(this.STATE_NAME_EXPANDABLE)) {
                    this
                        .removeCssClass('widget-retracted')
                        .addCssClass('widget-expanded');
                } else {
                    this
                        .removeCssClass('widget-expanded')
                        .addCssClass('widget-retracted');
                }
            }
        })
        .addMethods(/** @lends candystore.Expandable# */{
            /** Call from host's init. */
            init: function () {
                // expansion is not cascading (by default)
                this.addBinaryState(this.STATE_NAME_EXPANDABLE);
            },

            /** @ignore */
            afterStateOn: function (stateName) {
                if (stateName === this.STATE_NAME_EXPANDABLE) {
                    this._updateExpandedState();
                    this.triggerSync(this.EVENT_EXPAND);
                }
            },

            /** @ignore */
            afterStateOff: function (stateName) {
                if (stateName === this.STATE_NAME_EXPANDABLE) {
                    this._updateExpandedState();
                    this.triggerSync(this.EVENT_RETRACT);
                }
            },

            /** @returns {candystore.Expandable} */
            expandWidget: function () {
                this.addBinaryStateSource(this.STATE_NAME_EXPANDABLE, 'default');
                return this;
            },

            /** @returns {candystore.Expandable} */
            contractWidget: function () {
                this.removeBinaryStateSource(this.STATE_NAME_EXPANDABLE, 'default');
                return this;
            },

            /** @returns {boolean} */
            isExpanded: function () {
                return this.isStateOn(this.STATE_NAME_EXPANDABLE);
            }
        });
});
