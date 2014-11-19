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
        expect(5);

        var parent = BinaryStateful.create()
                .addState('foo')
                .addState('bar')
                .setRootWidget(),
            child = BinaryStateful.create()
                .addState('foo');

        parent.addMocks({
            getState: function () {
                ok(true, "should fetch parent's state");
                return true;
            }
        });

        child.addMocks({
            getState: function () {
                ok(true, "should fetch current state");
                return true;
            },

            afterStateOn: function (stateName) {
                equal(stateName, 'foo', "should call state handler");
            },

            addStateSource: function (stateName, sourceId) {
                equal(stateName, 'foo', "should add source to matching state");
                equal(sourceId, candystore.BinaryStateful.SOURCE_PARENT_IMPOSED,
                    "should add parent imposed source to state");
            }
        });

        child.addToParent(parent);
    });

    test("Removal handler", function () {
        var parent = BinaryStateful.create()
                .setRootWidget(),
            child = BinaryStateful.create()
                .addState('foo')
                .addState('bar')
                .addToParent(parent),
            removedStates = [];

        child.addMocks({
            removeStateSource: function (stateName, sourceId) {
                removedStates.push([stateName, sourceId]);
            }
        });

        child.removeFromParent();

        deepEqual(removedStates, [
            ['foo', candystore.BinaryStateful.SOURCE_PARENT_IMPOSED],
            ['bar', candystore.BinaryStateful.SOURCE_PARENT_IMPOSED]
        ], "should remove parent imposed source from all states");
    });

    test("State addition", function () {
        var binaryStateful = BinaryStateful.create();

        strictEqual(binaryStateful.addState('foo'), binaryStateful, "should be chainable");

        var sources = binaryStateful.binaryStates.getItem('foo');

        ok(sources.isA(sntls.Collection),
            "should add sources collection to binaryStates by specified name");
        equal(sources.getKeyCount(), 0,
            "should initialize sources collection as empty");

        binaryStateful.addState('foo');

        strictEqual(binaryStateful.binaryStates.getItem('foo'), sources,
            "should not overwrite sources collection on subsequent addition");
    });

    test("State presence tester", function () {
        var binaryStateful = BinaryStateful.create()
            .addState('foo');

        ok(!binaryStateful.hasState('bar'), "should return falsey for absent state");
        ok(binaryStateful.hasState('foo'), "should return truthy for state already added");
    });

    test("State sources getter", function () {
        var binaryStateful = BinaryStateful.create()
            .addState('foo');

        equal(typeof binaryStateful.getStateSources('bar'), 'undefined',
            "should return undefined for absent state");
        strictEqual(binaryStateful.getStateSources('foo'),
            binaryStateful.binaryStates.getItem('foo'),
            "should return sources collection for specified state");
    });

    test("Source addition", function () {
        expect(4);

        var binaryStateful = BinaryStateful.create()
            .addState('foo');

        binaryStateful.addMocks({
            afterStateOn: function (stateName) {
                equal(stateName, 'foo', "should call after handler");
            }
        });

        raises(function () {
            binaryStateful.addStateSource('bar', 'hello');
        }, "should raise exception on attempt to add to absent state");

        strictEqual(binaryStateful.addStateSource('foo', 'hello'), binaryStateful,
            "should be chainable");
        equal(binaryStateful.binaryStates.getItem('foo').items, {
                hello: true
            },
            "should set source in sources collection");
    });

    test("Source removal", function () {
        expect(5);

        var binaryStateful = BinaryStateful.create()
            .addState('foo');

        binaryStateful.addMocks({
            afterStateOff: function (stateName) {
                equal(stateName, 'foo', "should call after handler");
            }
        });

        binaryStateful.addStateSource('foo', 'hello');

        raises(function () {
            binaryStateful.removeStateSource('bar', 'hello');
        }, "should raise exception on attempt to add to absent state");

        strictEqual(binaryStateful.removeStateSource('foo', 'world'), binaryStateful,
            "should be chainable");
        equal(binaryStateful.binaryStates.getItem('foo').items, {
                hello: true
            },
            "should not change sources collection when attempting to remove absent source");

        binaryStateful.removeStateSource('foo', 'hello');
        equal(binaryStateful.binaryStates.getItem('foo').items, {},
            "should remove specified source from collection");
    });

    test("State value getter", function () {
        var binaryStateful = BinaryStateful.create()
            .addState('foo');

        raises(function () {
            binaryStateful.getState('bar');
        }, "should raise exception on absent state");

        ok(!binaryStateful.getState('foo'), "should return falsey on zero associated sources");

        binaryStateful.addStateSource('foo', 'hello');

        ok(binaryStateful.getState('foo'), "should return truthy on positive number of sources");
    });
}());
