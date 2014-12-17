/*global dessert, troop, sntls, evan, shoeshine, candystore */
troop.postpone(candystore, 'documentBody', function () {
    "use strict";

    /**
     * Manages the document body.
     * Use this to change or retrieve the body's attributes,
     * instead of checking / modifying the body HTMLElement directly.
     * @type {candystore.DocumentBody}
     */
    candystore.documentBody = candystore.DocumentBody.create();
});
