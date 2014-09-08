/*global dessert, troop, sntls, e$, shoeshine, candystore */
troop.postpone(candystore, 'PasswordInput', function (ns, className) {
    "use strict";

    var base = candystore.TextInput,
        self = base.extend(className);

    /**
     * @name candystore.PasswordInput.create
     * @function
     * @returns {candystore.PasswordInput}
     */

    /**
     * @class
     * @extends candystore.TextInput
     */
    candystore.PasswordInput = self
        .addMethods(/** @lends candystore.PasswordInput# */{
            /** @ignore */
            init: function () {
                base.init.call(this, 'password');
            },

            /**
             * @returns {string}
             * @ignore
             */
            contentMarkup: function () {
                return this.children.toString();
            },

            /** @returns {candystore.PasswordInput} */
            revealPassword: function () {
                if (this.htmlAttributes.getItem('type') === 'password') {
                    this.addAttribute('type', 'text');

                    if (this.getElement()) {
                        this.reRender();
                    }
                }
                return this;
            },

            /** @returns {candystore.PasswordInput} */
            obscurePassword: function () {
                if (this.htmlAttributes.getItem('type') !== 'password') {
                    this.addAttribute('type', 'password');

                    if (this.getElement()) {
                        this.reRender();
                    }
                }
                return this;
            },

            /** @returns {boolean} */
            isPasswordRevealed: function () {
                return this.htmlAttributes.getItem('type') !== 'password';
            }
        });
});

troop.amendPostponed(candystore, 'Input', function () {
    "use strict";

    candystore.Input
        .addSurrogate(candystore, 'PasswordInput', function (inputType) {
            return inputType === 'password';
        });
});
