(function (toExport) {
    "use strict";
    /**
     *
     * @param container
     * @field radius {Number} размер одного check point
     * @field distanceBetweenCheckPoint {Number} расстояния между двумя check point
     * @externs {Model}
     * @constructor
     */
    var CheckPointContainer = function (container) {
        this.graphicCheckPoints = [];
        this.checkPoints = [];
        toExport.Model.call(this, container);
        this.distanceBetweenCheckPoint = this.radius * 4;
    };

    CheckPointContainer.prototype = Object.create(toExport.Model.prototype, {
        constructor: {
            value: CheckPointContainer,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    toExport.CheckPointContainer = CheckPointContainer;

    /**
     * @function расставить check point точки между start и finish
     * @param start {Point2d}
     * @param end {Point2d}
     */
    CheckPointContainer.prototype.adds = function (start, end) {
        var that = this;
        this.start = start;
        this.end = end;
        this.getsDiff(start, end)
            .forEach(function (checkPoint) {
                that.createCheckPoint(checkPoint);
            });
    };

    /**
     * @function создать новый check point
     * @param point {Point2d} координаты check point
     */
    CheckPointContainer.prototype.createCheckPoint = function (point) {
        var circle = new toExport.fabric.Circle({
            "radius": this.radius,
            "left": point.x,
            "top": point.y,
            "fill": "red",
            "hasControls": false,
            "hasBorders": false,
            "lockMovementX": true,
            "lockMovementY": true
        });
        this.canvas.add(circle);
        this.graphicCheckPoints.push(circle);
        this.checkPoints.push(point);
    };

    /**
     * @function разбивает отрезок на равные кусочки на превышающие макс. длины
     * @param start {Point2d} начало отрезка
     * @param start {Point2d} конец отрезка
     */
    CheckPointContainer.prototype.getsDiff = function (start, end) {
        var left,
            right,
            middle = start.addWith(end).multiply(1 / 2);
        if (start.distanceTo(end) <= 2 * this.distanceBetweenCheckPoint) {
            return [middle];
        }
        left = this.getsDiff(start, middle);
        right = this.getsDiff(middle, end);
        return left.concat(right);
    };

    /**
     * @function удалить пройденные check point
     * @param point {Point2d} положение объекта
     */
    CheckPointContainer.prototype.removeLessOrEqualThan = function (point) {
        while (this.checkPoints.length !== 0 && this.checkPoints[0].between2Point(this.start, point)) {
            var graphicCheckPoint = this.graphicCheckPoints.shift();
            this.checkPoints.shift();
            graphicCheckPoint.canvas.remove(graphicCheckPoint);
        }
    };

    /**
     * @function удалить все check points
     */
    CheckPointContainer.prototype.clear = function () {
        this.checkPoints = [];
        this.graphicCheckPoints.forEach(function (checkPoint) {
            checkPoint.canvas.remove(checkPoint);
        });
        this.graphicCheckPoints = [];
    };
}(window));