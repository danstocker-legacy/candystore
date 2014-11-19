/*global dessert, troop, sntls, shoeshine, candystore */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Disableable");

    var base = shoeshine.Widget,
        Disableable = base.extend('Disableable')
            .addTraitAndExtend(candystore.BinaryStateful)
            .addTraitAndExtend(candystore.Disableable)
            .addMethods({
                init: function () {
                    base.init.call(this);
                    candystore.BinaryStateful.init.call(this);
                    candystore.Disableable.init.call(this);
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
        var disableable = Disableable.create();
        deepEqual(disableable.binaryStates.items, {
                'state-disableable': sntls.Collection.create()
            },
            "should initialize source collection for disabled");
    });

    test("State on handler", function () {
        expect(1);

        var disableable = Disableable.create();

        disableable.addMocks({
            _updateEnabledStyle: function () {
                ok(true, "should update disabled style");
            }
        });

        disableable.afterStateOn('foo');

        disableable.afterStateOn(candystore.Disableable.STATE_NAME_DISABLEBABLE);
    });

    test("State off handler", function () {
        expect(1);

        var disableable = Disableable.create();

        disableable.addMocks({
            _updateEnabledStyle: function () {
                ok(true, "should update disabled style");
            }
        });

        disableable.afterStateOff('foo');

        disableable.afterStateOff(candystore.Disableable.STATE_NAME_DISABLEBABLE);
    });

    test("Disabling", function () {
        var disableable = Disableable.create();

        strictEqual(disableable.disableBy('foo'), disableable, "should be chainable");

        deepEqual(
            disableable.getStateSources(candystore.Disableable.STATE_NAME_DISABLEBABLE).items,
            {
                'foo': true
            },
            "should set state source");

        disableable.disableBy('bar');

        deepEqual(
            disableable.getStateSources(candystore.Disableable.STATE_NAME_DISABLEBABLE).items,
            {
                'foo': true,
                'bar': true
            },
            "should set state source");
    });

    test("Disabling", function () {
        var disableable = Disableable.create()
            .disableBy('foo')
            .disableBy('bar');

        strictEqual(disableable.enableBy('foo'), disableable, "should be chainable");

        deepEqual(
            disableable.getStateSources(candystore.Disableable.STATE_NAME_DISABLEBABLE).items,
            {
                'bar': true
            },
            "should remove specified state source");
    });

    test("Force enable", function () {
        var disableable = Disableable.create()
            .disableBy('foo')
            .disableBy('bar');

        strictEqual(disableable.forceEnable(), disableable, "should be chainable");

        deepEqual(
            disableable.getStateSources(candystore.Disableable.STATE_NAME_DISABLEBABLE).items,
            {},
            "should remove all state sources");
    });

    test("Disabled state tester", function () {
        var disableable = Disableable.create();

        ok(!disableable.isDisabled(), "should return false for zero disabling source");

        disableable.disableBy('foo');

        ok(disableable.isDisabled(), "should return true for non-zero disabling source");
    });
}());
