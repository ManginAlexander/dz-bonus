(function (toExport) {
    /**
     * @class {Point2d} моделируют точку в двумерном пространстве
     * @param container {Object} объект, содержащий координаты x и y
     * @constructor
     */
    var Point2d = function (container) {
        toExport.Model.call(this, container);
    };
    Point2d.prototype.getAllError = function () {
        var resultError = [];
        if (typeof this.x === "number") {
            resultError.push(new FieldsError("x", "В поле должно быть число", true));
        }
        if (typeof this.y === "number") {
            resultError.push(new FieldsError("y", "В поле должно быть число", true));
        }
    };
    /**
     * @function вычисляет разность по оси абсцис между 2-мя точками
     * @param otherPoint {Point2d}
     * @return {Number}
     */
    Point2d.prototype.dx = function (otherPoint) {
        return otherPoint.x - this.x;
    };
    /**
     * @function вычисляет разность по оси ординат между 2-мя точками
     * @param otherPoint {Point2d}
     * @return {Number}
     */
    Point2d.prototype.dy = function (otherPoint) {
        return otherPoint.y - this.y;
    };
    /**
     * @function вычислает евклидово расстояние между двух точек
     * @param otherPoint {Point2d}
     * @return {Number}
     */
    Point2d.prototype.distanceTo = function (otherPoint) {
        return Math.sqrt(Math.pow(this.dx(otherPoint), 2)+Math.pow(this.dy(otherPoint), 2));
    };
    /**
     * @function сравнивает две точки
     * @param otherPoint {Point2d}
     * @return {Boolean}
     */
    Point2d.prototype.equal = function (otherPoint) {
        return (Math.abs(this.x - otherPoint.x) < 1 &&
            Math.abs(this.y - otherPoint.y) < 1);
    };
    /**
     * @function функция проверяет принадлежит ли точка конкретному сегменту прямой
     * @param line {Line2d}
     * @return {Boolean}
     */
    Point2d.prototype.onSegmentLine = function (line) {
        var minX, maxX,minY,maxY;

        if (!line.onLine(this)) {
            return false;
        }
        minX = Math.min(line.start.x, line.finish.x);
        maxX = Math.max(line.start.x, line.finish.x);
        minY = Math.min(line.start.y, line.finish.y);
        maxY = Math.max(line.start.y, line.finish.y);
        return minX <= this.x && this.x <= maxX &&
            minY <= this.y && this.y <= maxY;
    };
    Point2d.prototype = Object.create(toExport.Model.prototype, {
        constructor: {
            value: Event,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    toExport.Point2d = Point2d;
}(window));