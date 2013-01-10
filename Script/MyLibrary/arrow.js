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
    toExport.fabric.Arrow = fabric.util.createClass(fabric.Object, {

        type: 'arrow',

        initialize: function (options) {
            this.callSuper('initialize', options);
            this.arrowHeight = options.arrowHeight || 20;
            this.arrowWidth = options.arrowWidth || 30;
            this.bodyWidth = options.bodyWidth || 10;
            this.bodyHeidht = options.bodyHeidht || 50;

            this.set('width', this.arrowWidth + this.bodyWidth)
                .set('height', this.arrowHeight + this.bodyHeidht);
        },
        "setBodyHeight": function (height) {
            this.bodyHeidht = height;
            return this;
        },

        _render: function (ctx) {
            var heightBy2 = (this.arrowHeight + this.bodyHeidht) / 2,
                arrowWidthBy2 = this.arrowHeight / 2,
                bodyWidthBy2 = this.bodyWidth / 2;
            ctx.beginPath();
            ctx.moveTo(0, -heightBy2);
            ctx.lineTo(arrowWidthBy2, -heightBy2 + this.arrowHeight);
            ctx.lineTo(bodyWidthBy2, -heightBy2 + this.arrowHeight);
            ctx.lineTo(bodyWidthBy2, heightBy2);
            ctx.lineTo(-bodyWidthBy2, heightBy2);
            ctx.lineTo(-bodyWidthBy2, heightBy2 - this.bodyHeidht);
            ctx.lineTo(-arrowWidthBy2, heightBy2 - this.bodyHeidht);
            ctx.closePath();

            if (this.fill) {
                ctx.fill();
            }
            if (this.stroke) {
                ctx.stroke();
            }
        }
    });
}(window));