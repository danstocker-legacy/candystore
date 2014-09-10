/*global dessert, troop, sntls, e$, shoeshine, candystore */
troop.postpone(candystore, 'PasswordInput', function (ns, className) {
    "use strict";

    var base = candystore.TextInput,
        self = base.extend(className);

    /**
     * Creates a PasswordInput instance.
     * @name candystore.PasswordInput.create
     * @function
     * @returns {candystore.PasswordInput}
     */

    /**
     * The PasswordInput extends TextInput with the option that its input type will be set to 'password'.
     * Supports revealing and obscuring the entered password.
     * Also delegates surrogate to Input: instantiating an Input with 'type'='password' will yield a PasswordInput instance.
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

            /**
             * Reveals password by changing the input type to 'text', and re-rendering the widget.
             * @returns {candystore.PasswordInput}
             */
            revealPassword: function () {
                if (this.htmlAttributes.getItem('type') === 'password') {
                    this.addAttribute('type', 'text');

                    if (this.getElement()) {
                        this.reRender();
                    }
                }
                return this;
            },

            /**
             * Obscures password by changing the input type to 'password', and re-rendering the widget.
             * @returns {candystore.PasswordInput}
             */
            obscurePassword: function () {
                if (this.htmlAttributes.getItem('type') !== 'password') {
                    this.addAttribute('type', 'password');

                    if (this.getElement()) {
                        this.reRender();
                    }
                }
                return this;
            },

            /**
             * Determines whether the password input is currently revealed.
             * @returns {boolean}
             */
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
