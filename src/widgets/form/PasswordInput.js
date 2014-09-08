/*global dessert, troop, sntls, e$, s$, app */
troop.postpone(app.widgets, 'PasswordInput', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = widgets.TextInput,
        self = base.extend(className);

    /**
     * @name app.widgets.PasswordInput.create
     * @function
     * @returns {app.widgets.PasswordInput}
     */

    /**
     * @class
     * @extends app.widgets.TextInput
     */
    app.widgets.PasswordInput = self
        .addMethods(/** @lends app.widgets.PasswordInput# */{
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

            /** @returns {app.widgets.PasswordInput} */
            revealPassword: function () {
                if (this.htmlAttributes.getItem('type') === 'password') {
                    this.addAttribute('type', 'text');

                    if (this.getElement()) {
                        this.reRender();
                    }
                }
                return this;
            },

            /** @returns {app.widgets.PasswordInput} */
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

troop.amendPostponed(app.widgets, 'Input', function (/**app.widgets*/widgets) {
    "use strict";

    widgets.Input
        .addSurrogate(widgets, 'PasswordInput', function (inputType) {
            return inputType === 'password';
        });
});
