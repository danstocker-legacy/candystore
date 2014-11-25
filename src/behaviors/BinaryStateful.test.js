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
        expect(3);

        var parent = BinaryStateful.create()
                .addBinaryState('foo', true)
                .addBinaryState('bar', true)
                .setRootWidget(),
            child = BinaryStateful.create()
                .addBinaryState('foo', true);

        child.addMocks({
            applyImposedStateSource: function (stateName) {
                equal(stateName, 'foo', "should apply imposed sources for specified state");
            },

            isStateOn: function (stateName) {
                equal(stateName, 'foo', "should test parent's state");
                return true;
            },

            afterStateOn: function (stateName) {
                equal(stateName, 'foo', "should add imposed sources");
            }
        });

        child.addToParent(parent);
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

    test("Source addition", function () {
        expect(7);

        var parent = BinaryStateful.create()
                .addBinaryState('foo'),
            child = BinaryStateful.create()
                .addBinaryState('foo', true)
                .addToParent(parent);

        parent.addMocks({
            afterStateOn: function (stateName) {
                equal(stateName, 'foo', "should call after state handler");
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

        BinaryStateful.addMocks({
            addImposedStateSource: function (stateName, statefulInstance) {
                strictEqual(this, child, "should add imposed state to child");
                equal(stateName, 'foo', "should pass state name to imposed source setter");
                strictEqual(statefulInstance, parent, "should pass parent to imposed source setter");
            }
        });

        strictEqual(parent.addBinaryStateSource('foo', 'hello'), parent,
            "should be chainable");

        candystore.BinaryState.removeMocks();
        BinaryStateful.removeMocks();
    });

    test("Imposed source addition", function () {
        expect(4);

        var parent = BinaryStateful.create()
                .addBinaryState('foo'),
            child = BinaryStateful.create()
                .addBinaryState('foo');

        child.addMocks({
            afterStateOn: function (stateName) {
                equal(stateName, 'foo', "should call after state handler");
            }
        });

        var i = 0;
        candystore.BinaryState.addMocks({
            addSource: function (sourceId) {
                equal(this.stateName, 'foo', "should add source to selected state");
                equal(sourceId, 'imposed-' + parent.instanceId, "should add imposed source to state");
            },

            getSourceCount: function () {
                return i++;
            }
        });

        strictEqual(child.addImposedStateSource('foo', parent), child,
            "should be chainable");

        candystore.BinaryState.removeMocks();
    });

    test("Applying imposed source", function () {
        expect(3);

        var parent = BinaryStateful.create()
                .addBinaryState('foo')
                .addBinaryStateSource('foo', 'bar'),
            child = BinaryStateful.create()
                .addBinaryState('foo')
                .addToParent(parent);

        child.addMocks({
            addImposedStateSource: function (stateName, statefulInstance) {
                equal(stateName, 'foo', "should pass state name to imposed source setter");
                strictEqual(statefulInstance, parent, "should pass parent to imposed source setter");
            }
        });

        strictEqual(child.applyImposedStateSource('foo'), child,
            "should be chainable");
    });

    test("Source removal", function () {
        expect(7);

        var parent = BinaryStateful.create()
                .addBinaryState('foo'),
            child = BinaryStateful.create()
                .addBinaryState('foo')
                .addToParent(parent);

        parent.addMocks({
            afterStateOff: function (stateName) {
                equal(stateName, 'foo', "should call after handler");
            }
        });

        parent.addBinaryStateSource('foo', 'hello');

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

        BinaryStateful.addMocks({
            removeImposedStateSource: function (stateName, statefulInstance) {
                strictEqual(this, child, "should remove imposed state from child");
                equal(stateName, 'foo', "should pass state name to imposed source removal");
                strictEqual(statefulInstance, parent, "should pass parent to imposed source removal");
            }
        });

        strictEqual(parent.removeBinaryStateSource('foo', 'world'), parent,
            "should be chainable");

        candystore.BinaryState.removeMocks();
        BinaryStateful.removeMocks();
    });

    test("Source removal", function () {
        expect(4);

        var parent = BinaryStateful.create()
                .addBinaryState('foo'),
            child = BinaryStateful.create()
                .addBinaryState('foo');

        child.addMocks({
            afterStateOff: function (stateName) {
                equal(stateName, 'foo', "should call after handler");
            }
        });

        var i = 1;
        candystore.BinaryState.addMocks({
            removeSource: function (sourceId) {
                equal(this.stateName, 'foo', "should remove source from selected state");
                equal(sourceId, 'imposed-' + parent.instanceId, "should remove imposed source from state");
            },

            getSourceCount: function () {
                return i--;
            }
        });

        strictEqual(child.removeImposedStateSource('foo', parent), child,
            "should be chainable");

        candystore.BinaryState.removeMocks();
    });
}());
