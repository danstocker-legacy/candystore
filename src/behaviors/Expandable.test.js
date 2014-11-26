/*global dessert, troop, sntls, shoeshine, candystore */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Expandable");

    var base = shoeshine.Widget,
        Expandable = base.extend('Expandable')
            .addTraitAndExtend(candystore.BinaryStateful)
            .addTraitAndExtend(candystore.Expandable)
            .addMethods({
                init: function () {
                    base.init.call(this);
                    candystore.BinaryStateful.init.call(this);
                    candystore.Expandable.init.call(this);
                },

                afterAdd: function () {
                    base.afterAdd.call(this);
                    candystore.BinaryStateful.afterAdd.call(this);
                },

                afterRemove: function () {
                    base.afterRemove.call(this);
                    candystore.BinaryStateful.afterRemove.call(this);
                }
            });

    test("Instantiation", function () {
        Expandable.addMocks({
            addBinaryState: function (stateName) {
                equal(stateName, candystore.Expandable.STATE_NAME_EXPANDABLE,
                    "should add expandable state to instance");
            }
        });

        Expandable.create();

        Expandable.removeMocks();
    });

    test("State on handler", function () {
        expect(1);

        var expandable = Expandable.create();

        expandable.addMocks({
            _updateExpandedState: function () {
                ok(true, "should update expandable state");
            }
        });

        expandable.afterStateOn('foo');

        expandable.afterStateOn(candystore.Expandable.STATE_NAME_EXPANDABLE);
    });

    test("State off handler", function () {
        expect(1);

        var expandable = Expandable.create();

        expandable.addMocks({
            _updateExpandedState: function () {
                ok(true, "should update expandable state");
            }
        });

        expandable.afterStateOff('foo');

        expandable.afterStateOff(candystore.Expandable.STATE_NAME_EXPANDABLE);
    });

    test("Expansion", function () {
        expect(3);

        var expandable = Expandable.create();

        expandable.addMocks({
            addBinaryStateSource: function (stateName, sourceId) {
                equal(stateName, 'state-expandable', "should add source to expandable state");
                equal(sourceId, 'default', "should add specified source");
            }
        });

        strictEqual(expandable.expandWidget(), expandable, "should be chainable");
    });

    test("Contraction", function () {
        expect(3);

        var expandable = Expandable.create();

        expandable.addMocks({
            removeBinaryStateSource: function (stateName, sourceId) {
                equal(stateName, 'state-expandable', "should add source to expandable state");
                equal(sourceId, 'default', "should add specified source");
            }
        });

        strictEqual(expandable.contractWidget(), expandable, "should be chainable");
    });

    test("Highlighted state tester", function () {
        var expandable = Expandable.create();

        ok(!expandable.isExpanded(), "should return false when not expanded");

        expandable.expandWidget();

        ok(expandable.isExpanded(), "should return true when expanded");
    });
}());
