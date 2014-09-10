/*global dessert, troop, sntls, shoeshine, candystore */
troop.postpone(candystore, 'Flow', function (ns, className) {
    "use strict";

    var base = candystore.List,
        self = base.extend(className);

    /**
     * Creates a Flow instance.
     * @name candystore.Flow.create
     * @function
     * @returns {candystore.Flow}
     */

    /**
     * The Flow allows to navigate between a set of stage widgets.
     * @class
     * @extends candystore.List
     */
    candystore.Flow = self
        .addMethods(/** @lends candystore.Flow# */{
            /** @ignore */
            init: function () {
                base.init.call(this);

                /**
                 * Identifies current stage.
                 * Name of the stage widget that is currently in focus.
                 * @type {string}
                 */
                this.currentStageName = undefined;

                /**
                 * Collection of available stage widgets.
                 * @type {shoeshine.WidgetCollection}
                 */
                this.stages = shoeshine.WidgetCollection.create();
            },

            /**
             * Retrieves stage widget the flow is currently at.
             * @returns {shoeshine.Widget}
             */
            getCurrentStage: function () {
                return this.stages.getItem(this.currentStageName);
            },

            /**
             * Adds a stage to the flow.
             * Adds various CSS classes to the specified stage widget.
             * @param {string} stageName
             * @param {shoeshine.Widget} stageWidget
             * @returns {candystore.Flow}
             */
            addStage: function (stageName, stageWidget) {
                this.stages.setItem(stageName, stageWidget
                    .addCssClass(stageName)
                    .addCssClass('flow-stage'));
                return this;
            },

            /**
             * Goes to the specified stage.
             * @param {string} stageName
             * @returns {candystore.Flow}
             */
            goToStage: function (stageName) {
                var stages = this.stages,
                    currentStage = stages.getItem(this.currentStageName),
                    stageWidget = stages.getItem(stageName);

                dessert.assert(!!stageWidget, "Invalid stage name");

                // applying new stage
                if (currentStage) {
                    currentStage.removeFromParent();
                }
                this.addItemWidget(stageWidget);

                // updating instance property
                this.currentStageName = stageName;

                return this;
            }
        });
});
