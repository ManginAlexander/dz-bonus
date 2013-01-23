(function (toExport) {
    "use strict";
    /**
     * @constructor создает круг
     * @param container {Object}
     * @field center {Point2d} Координаты центра круга
     * @field redius {Number} радиус круга
     * @constructor
     */
    var Circle2d = function (container) {
        toExport.Model.call(this, container);
    };
    toExport.Circle2d = Circle2d;
    Circle2d.prototype = Object.create(toExport.Model.prototype, {
        constructor: {
            value: Circle2d,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    /**
     * @function лежит ли круг на линии
     * @param line {Line2d}
     */
    Circle2d.prototype.onLine = function (line) {
        return line.getDistanceTo(this.center) < this.radius;
    };
    /**
     * @function лежит ли круг на отрезке линии
     * @param line {Line2d}
     */
    Circle2d.prototype.onSegment = function (line) {
        var projectionCenterOnLine = line.getNormalLine(this.center).getCross(line);
        return projectionCenterOnLine.between2Point(line.start, line.finish);
    };
    /**
     * @function найти точку в которой круг столкнется с точкой
     * @param movingLine {Line2d} Линия движения круга
     * @param point {Point2d}
     * @return {*}
     */
    Circle2d.prototype.getCrossWithPoint = function (movingLine, point) {
        var projectionPoint = movingLine.getProjection(point),
            needVector = projectionPoint.subtractWith(point),
            distanceBetweenLineAndPoint = projectionPoint.getDistanceTo(point),
            distanceBetweenCenterCircleAndPrPoint = this.center.getDistanceTo(projectionPoint);
        //Пересечения нет, если шарик летит не в ту сторону или летит далеко
        if (distanceBetweenLineAndPoint > this.radius) {
            return null;
        }
        return movingLine.getPoint(this.center, distanceBetweenCenterCircleAndPrPoint - Math.sqrt(this.radius * this.radius - distanceBetweenLineAndPoint * distanceBetweenLineAndPoint));
    };
    /**
     * @function найти пересечение с углом отрезка (Окружность не пересекает отрезок)
     * @param movingLine {Line2d}
     * @param line {Line2d}
     * @return {Point2d}
     */
    Circle2d.prototype.getCrossWithSegmentsAngles = function (movingLine, line) {
        var crossWithStart = this.getCrossWithPoint(movingLine, line.start),
            crossWithFinish = this.getCrossWithPoint(movingLine, line.finish);
        if (crossWithStart === null && crossWithFinish === null) {
            return null;
        }
        if (crossWithStart === null) {
            return crossWithFinish;
        }
        if (crossWithFinish === null) {
            return crossWithStart;
        }
        if (this.center.getDistanceTo(crossWithStart) < this.center.getDistanceTo(crossWithFinish)) {
            return crossWithStart;
        } else {
            return crossWithFinish;
        }
    };
}(window));