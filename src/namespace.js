/**
 * Top-Level Library Namespace
 */
/*global require */
/** @namespace */
var candystore = {
        /**
         * Whether to poll input values at a regular interval.
         * Set to true when change/input events do not get fired on form autofill, etc.
         * @type {boolean}
         */
        pollInputValues: false
    },
    c$ = candystore;

/**
 * @class
 * @see https://github.com/production-minds/dessert
 */
var dessert = dessert || require('dessert');

/**
 * @namespace
 * @see https://github.com/production-minds/troop
 */
var troop = troop || require('troop');

/**
 * @namespace
 * @see https://github.com/danstocker/sntls
 */
var sntls = sntls || require('sntls');

/**
 * @namespace
 * @see https://github.com/danstocker/evan
 */
var evan = evan || require('evan');

/**
 * @function
 * @see http://api.jquery.com
 */
var jQuery = jQuery || require('jquery');

/**
 * @namespace
 * @see https://github.com/danstocker/bookworm
 */
var bookworm = bookworm || require('bookworm');

/**
 * @namespace
 * @see https://github.com/danstocker/shoeshine
 */
var shoeshine = shoeshine || require('shoeshine');

if (typeof window === 'undefined') {
    /**
     * Built-in global window object.
     * @type {Window}
     */
    window = undefined;
}

if (typeof document === 'undefined') {
    /**
     * Built-in global document object.
     * @type {Document}
     */
    document = undefined;
}

/**
 * Native number class.
 * @name Number
 * @class
 */

/**
 * Native string class.
 * @name String
 * @class
 */

/**
 * Native array class.
 * @name Array
 * @class
 */

/**
 * @name sntls.Hash
 * @class
 */
