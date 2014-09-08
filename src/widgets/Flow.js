/*global dessert, troop, sntls, s$, app */
troop.postpone(app.widgets, 'Flow', function (/**app.widgets*/widgets, className) {
    "use strict";

    var base = widgets.List,
        self = base.extend(className);

    /**
     * @name app.widgets.Flow.create
     * @function
     * @returns {app.widgets.Flow}
     */

    /**
     * @class
     * @extends app.widgets.List
     */
    app.widgets.Flow = self
        .addMethods(/** @lends app.widgets.Flow# */{
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
                this.stages = s$.WidgetCollection.create();
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
             * @param {string} stageName
             * @param {shoeshine.Widget} stageWidget
             * @returns {app.widgets.Flow}
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
             * @returns {app.widgets.Flow}
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
