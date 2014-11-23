/*global dessert, troop, sntls, shoeshine, candystore */
/*global module, test, expect, ok, equal, strictEqual, notStrictEqual, deepEqual, notDeepEqual, raises */
(function () {
    "use strict";

    module("BinaryStateful");

    var base = shoeshine.Widget,
        BinaryStateful = base.extend('BinaryStateful')
            .addTraitAndExtend(candystore.BinaryStateful)
            .addMethods({
                init: function () {
                    base.init.call(this);
                    candystore.BinaryStateful.init.call(this);
                },

                afterAdd: function () {
                    base.afterAdd.call(this);
                    candystore.BinaryStateful.afterAdd.call(this);
                },

                afterRemove: function () {
                    base.afterRemove.call(this);
                    candystore.BinaryStateful.afterRemove.call(this);
                },

                afterStateOn: function () {

                },

                afterStateOff: function () {

                }
            });

    test("Instantiation", function () {
        var binaryStateful = BinaryStateful.create();

        ok(binaryStateful.binaryStates.isA(sntls.Collection), "should add binaryStates property");
        equal(binaryStateful.binaryStates.getKeyCount(), 0,
            "should initialize states collection as empty");
    });

    test("Addition handler", function () {
        expect(7);

        var parent = BinaryStateful.create()
                .addBinaryState('foo', true)
                .addBinaryState('bar', true)
                .setRootWidget(),
            child = BinaryStateful.create()
                .addBinaryState('foo', true);

        parent.addMocks({
        });

        candystore.BinaryState.addMocks({
            addStateAsSource: function (state, sourceId) {
                ok(state.isA(candystore.BinaryState), "should add binary state as source");
                equal(state.stateName, 'foo', "should pass state with matching state name");
                equal(sourceId, 'imposed-' + parent.instanceId,
                    "should add parent imposed source to state");
            },

            isStateOn: function () {
                ok(true, "should fetch parent's state");
                return true;
            }
        });

        child.addMocks({
            isStateOn: function () {
                ok(true, "should fetch current state");
                return true;
            },

            afterStateOn: function (stateName, sourceIdsBefore) {
                equal(stateName, 'foo', "should call state handler");
                deepEqual(sourceIdsBefore, [], "should pass before state of source ID array");
            }
        });

        child.addToParent(parent);

        candystore.BinaryState.removeMocks();
    });

    test("Removal handler", function () {
        var parent = BinaryStateful.create()
                .addBinaryState('foo', true)
                .addBinaryStateSource('foo', 'hello')
                .setRootWidget(),
            child = BinaryStateful.create()
                .addBinaryState('foo', true)
                .addBinaryState('bar', true)
                .addToParent(parent),
            removedStates = [];

        child.addMocks({
            removeBinaryStateSource: function (stateName, sourceId) {
                removedStates.push([stateName, sourceId]);
            }
        });

        child.removeFromParent();

        deepEqual(removedStates, [
            ['foo', 'imposed-' + parent.instanceId]
        ], "should remove parent imposed source from all states");
    });

    test("State addition", function () {
        var binaryStateful = BinaryStateful.create();

        strictEqual(binaryStateful.addBinaryState('foo'), binaryStateful, "should be chainable");

        var state = binaryStateful.binaryStates.getItem('foo');

        ok(state.isA(candystore.BinaryState),
            "should add BinaryState instance to binaryStates by specified name");

        binaryStateful.addBinaryState('foo');

        strictEqual(binaryStateful.binaryStates.getItem('foo'), state,
            "should not overwrite sources collection on subsequent addition");
    });

    test("State getter", function () {
        var binaryStateful = BinaryStateful.create()
            .addBinaryState('foo');

        equal(typeof binaryStateful.getBinaryState('bar'), 'undefined',
            "should return undefined for absent state");
        strictEqual(binaryStateful.getBinaryState('foo'),
            binaryStateful.binaryStates.getItem('foo'),
            "should return BinaryState instance for state already added");
    });

    test("Source addition", function () {
        expect(6);

        var binaryStateful = BinaryStateful.create()
            .addBinaryState('foo');

        binaryStateful.addMocks({
            afterStateOn: function (stateName, sourceIdsBefore) {
                equal(stateName, 'foo', "should call after handler");
                deepEqual(sourceIdsBefore, [], "should pass before state of source ID array");
            }
        });

        var i = 0;
        candystore.BinaryState.addMocks({
            addSource: function (sourceId) {
                equal(this.stateName, 'foo', "should add source to selected state");
                equal(sourceId, 'hello', "should add specified source to state");
            },

            getSourceCount: function () {
                return i++;
            }
        });

        raises(function () {
            binaryStateful.addBinaryStateSource('bar', 'hello');
        }, "should raise exception on attempt to add to absent state");

        strictEqual(binaryStateful.addBinaryStateSource('foo', 'hello'), binaryStateful,
            "should be chainable");

        candystore.BinaryState.removeMocks();
    });

    test("Source removal", function () {
        expect(6);

        var binaryStateful = BinaryStateful.create()
            .addBinaryState('foo');

        binaryStateful.addMocks({
            afterStateOff: function (stateName, sourceIdsBefore) {
                equal(stateName, 'foo', "should call after handler");
                deepEqual(sourceIdsBefore, ['hello'], "should pass source ID array before change");
            }
        });

        binaryStateful.addBinaryStateSource('foo', 'hello');

        var i = 1;
        candystore.BinaryState.addMocks({
            removeSource: function (sourceId) {
                equal(this.stateName, 'foo', "should remove source to selected state");
                equal(sourceId, 'world', "should remove specified source to state");
            },

            getSourceCount: function () {
                return i--;
            }
        });

        raises(function () {
            binaryStateful.removeBinaryStateSource('bar', 'hello');
        }, "should raise exception on attempt to add to absent state");

        strictEqual(binaryStateful.removeBinaryStateSource('foo', 'world'), binaryStateful,
            "should be chainable");

        candystore.BinaryState.removeMocks();
    });

    test("State value getter", function () {
        var binaryStateful = BinaryStateful.create()
            .addBinaryState('foo');

        raises(function () {
            binaryStateful.isStateOn('bar');
        }, "should raise exception on absent state");

        ok(!binaryStateful.isStateOn('foo'), "should return falsey on zero associated sources");

        binaryStateful.addBinaryStateSource('foo', 'hello');

        ok(binaryStateful.isStateOn('foo'), "should return truthy on positive number of sources");
    });
}());
