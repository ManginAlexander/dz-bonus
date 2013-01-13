/*global
FieldsError:false
 */
(function (toExport) {
    "use strict";
    /**
     * @class {Point2d} моделируют точку в двумерном пространстве
     * @param container {Object} объект, содержащий координаты x и y
     * @constructor
     */
    var Point2d = function (container) {
        toExport.Model.call(this, container);
    };
    Point2d.prototype = Object.create(toExport.Model.prototype, {
        constructor: {
            value: Point2d,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    toExport.Point2d = Point2d;
    /**
     * @function возвращает все ошибки
     */
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
        return Math.sqrt(Math.pow(this.dx(otherPoint), 2) + Math.pow(this.dy(otherPoint), 2));
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
     * @function функция проверяет принадлежит ли точка между двумя точками или нет
     * @param a {Point2d}
     * @param b {Point2d}
     * @return {Boolean}
     */
    Point2d.prototype.between2Point = function (a, b) {
        var minX, maxX, minY, maxY;

        minX = Math.min(a.x, b.x);
        maxX = Math.max(a.x, b.x);
        minY = Math.min(a.y, b.y);
        maxY = Math.max(a.y, b.y);
        return minX <= this.x && this.x <= maxX &&
            minY <= this.y && this.y <= maxY;
    };
    /**
     * @function Разворот вектора
     * @return {Point2d}
     */
    Point2d.prototype.invert = function () {
        return this.multiply(-1);
    };
    /**
     * @function вычитание двух векторов
     * @param otherPoint {Point2d}
     * @return {Point2d}
     */
    Point2d.prototype.subtractWith = function (otherPoint) {
        return new Point2d({
            "x": this.x - otherPoint.x,
            "y": this.y - otherPoint.y
        });
    };
    /**
     * @function сложение двух векторов
     * @param otherPoint {Point2d}
     * @return {Point2d}
     */
    Point2d.prototype.addWith = function (otherPoint) {
        return new Point2d({
            "x": this.x + otherPoint.x,
            "y": this.y + otherPoint.y
        });
    };
    /**
     * Нормализация вектора
     * @return {Point2d}
     */
    Point2d.prototype.getNormalizedVector = function () {
        return this.multiply(1 / this.distanceTo(Point2d.Zero));
    };
    /**
     * Умножение вектора на число
     * @param number {Number}
     * @return {Point2d}
     */
    Point2d.prototype.multiply = function (number) {
        return new Point2d({
            "x": this.x * number,
            "y": this.y * number
        });
    };
    /**
     * Векторы коллинеарны
     * @param otherVector {Point2d}
     * @return {Boolean}
     */
    Point2d.prototype.isCollinearity = function (otherVector) {
        return Math.abs(this.x * otherVector.y - this.y * otherVector.x) < 0.01;
    };
    /**
     * Векторы коллинеарны и соноправленны
     * @param otherVector {Point2d}
     * @return {Boolean}
     */
    Point2d.prototype.isCollinear = function (otherVector) {
        if (!this.isCollinearity(otherVector)) {
            return false;
        }
        var mineXPos = this.x > 0,
            mineYPos = this.y > 0,
            otherXPos = otherVector.x > 0,
            otherYPos = otherVector.y > 0;
        return mineXPos === otherXPos && mineYPos === otherYPos;
    };
    /**
     * @static Ноль
     * @type {Point2d}
     */
    Point2d.Zero = new Point2d({
        "x": 0,
        "y": 0
    });
    Point2d.prototype.toString = function () {
        return "(" + this.x + ", " + this.y + ")";
    };

}(window));