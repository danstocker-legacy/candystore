/*global dessert, troop, sntls, shoeshine, candystore */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("Highlightable");

    var base = shoeshine.Widget,
        Highlightable = base.extend('Highlightable')
            .addTraitAndExtend(candystore.BinaryStateful)
            .addTraitAndExtend(candystore.Highlightable)
            .addMethods({
                init: function () {
                    base.init.call(this);
                    candystore.BinaryStateful.init.call(this);
                    candystore.Highlightable.init.call(this);
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
        Highlightable.addMocks({
            addBinaryState: function (stateName) {
                equal(stateName, candystore.Highlightable.STATE_NAME_HIGHLIGHTABLE,
                    "should add highlightable state to instance");
            }
        });

        var highlightable = Highlightable.create();

        Highlightable.removeMocks();

        ok(highlightable.highlightIds.isA(sntls.Collection), "should add highlightIds property");
        equal(highlightable.highlightIds.getKeyCount(), 0,
            "should initialize highlightIds to empty collection");
    });

    test("State on handler", function () {
        expect(1);

        var highlightable = Highlightable.create();

        highlightable.addMocks({
            _updateHighlightedState: function () {
                ok(true, "should update highlighted state");
            }
        });

        highlightable.afterStateOn('foo');

        highlightable.afterStateOn(candystore.Highlightable.STATE_NAME_HIGHLIGHTABLE);
    });

    test("State off handler", function () {
        expect(1);

        var highlightable = Highlightable.create();

        highlightable.addMocks({
            _updateHighlightedState: function () {
                ok(true, "should update highlighted state");
            }
        });

        highlightable.afterStateOff('foo');

        highlightable.afterStateOff(candystore.Highlightable.STATE_NAME_HIGHLIGHTABLE);
    });

    test("Highlight on", function () {
        var highlightable = Highlightable.create(),
            result = [];

        raises(function () {
            highlightable.highlightOn(123);
        }, "should raise exception on invalid argument");

        highlightable.addMocks({
            addBinaryStateSource: function (stateName, sourceId) {
                result.push([stateName, sourceId]);
            }
        });

        strictEqual(highlightable.highlightOn('foo'), highlightable, "should be chainable");
        highlightable.highlightOn();

        deepEqual(result, [
            ['state-highlightable', 'foo'],
            ['state-highlightable', 'highlighted']
        ], "should add specified or default sources");
    });

    test("Highlight off", function () {
        var highlightable = Highlightable.create(),
            result = [];

        raises(function () {
            highlightable.highlightOff(123);
        }, "should raise exception on invalid argument");

        highlightable.addMocks({
            removeBinaryStateSource: function (stateName, sourceId) {
                result.push([stateName, sourceId]);
            }
        });

        strictEqual(highlightable.highlightOff('foo'), highlightable, "should be chainable");
        highlightable.highlightOff();

        deepEqual(result, [
            ['state-highlightable', 'foo'],
            ['state-highlightable', 'highlighted']
        ], "should remove specified or default sources");
    });

    test("Highlighted state tester", function () {
        var highlightable = Highlightable.create()
            .highlightOn('foo');

        raises(function () {
            highlightable.isHighlighted(123);
        }, "should raise exception on invalid argument");

        ok(!highlightable.isHighlighted('bar'), "should return false for absent source");
        ok(highlightable.isHighlighted('foo'), "should return true for present source");
        ok(highlightable.isHighlighted(), "should return true for no source at non-zero sources");
    });
}());
