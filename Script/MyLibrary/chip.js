/*global
 fabric: false,
 */
(function (toExport) {
    "use strict";
    /**
     *
     * @class {Arrow} реализует стрелочки ->
     * @externs {fabric.Object}
     */
    toExport.fabric.Chip = fabric.util.createClass(fabric.Circle, {

        type: 'chip',

        initialize: function (options) {
            this.left = options.x || 0;
            this.top = options.y || 0;
            this.radius = options.radius || 1;
            this.set('width', 2 * options.radius)
                .set('height', 2 * options.radius);
            this.setGradientFill({
                x1: 0,
                y1: 0,
                x2: 0,
                y2: this.height,
                colorStops: {
                    0: '#a6cbfb',
                    1: '#5495d3'
                }
            });
            this.set({ strokeWidth: 1, stroke: 'rgba(33,127,213,1)' });
            this.hasBorders = this.hasControls = false;
            this.lockMovementX = this.lockMovementY = true;


        },
        "setBodyHeight": function (height) {
            this.bodyHeidht = height;
            return this;
        }
    });
}(window));