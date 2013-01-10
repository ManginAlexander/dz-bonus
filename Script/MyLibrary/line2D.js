/*global
 FieldsError: false,
 Point2d:false
 */
(function (toExport) {
    "use strict";
    /**
     * @class моделирует линию в двумерном пространстве
     * @field  start {Point2d} конечная точка отрезка
     * @field  finish {Point2d} конечная точка отрезка
     * @field  a {Number} коэффицент в уравнении прямой
     * @field  b {Number} коэффицент в уравнении прямой
     * @field  c {Number} коэффицент в уравнении прямой
     * @constructor
     */
    var Line2d = function (container) {
        toExport.Model.call(this, container);
        this.a = -this.dy();
        this.b = this.dx();
        this.c = this.start.x * this.finish.y - this.finish.x * this.start.y;
    },
        /**
         * @function Читерски создает уравнение прямой из коэффицентов
         * @param  a {Number} коэффицент в уравнении прямой
         * @param  b {Number} коэффицент в уравнении прямой
         * @param  c {Number} коэффицент в уравнении прямой
         */
        getFakeLine = function (a, b, c) {
            var line = new Line2d({
                "start": new Point2d({
                    "x": 0,
                    "y": 0
                }),
                "finish": new Point2d({
                    "x": 1,
                    "y": 1
                })
            });
            line.a = a;
            line.b = b;
            line.c = c;
            return line;
        };
    Line2d.prototype = Object.create(toExport.Model.prototype, {
        constructor: {
            value: Line2d,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    toExport.Line2d = Line2d;

    /**
     * @function возвращает массив ошибок
     * @return {Array} возвращает массив ошибок
     */
    Line2d.prototype.getAllError = function () {
        var resultError = [],
            textTypeError = "В поле должна быть точка",
            textEqualError = "Начальная и конечная точка не может совпадать";
        if (this.start instanceof toExport.Point2d) {
            resultError.push(new FieldsError("start", textTypeError, true));
        }
        if (this.finish instanceof toExport.Point2d) {
            resultError.push(new FieldsError("finish", textTypeError, true));
        }
        if (this.finish.equal(this.start)) {
            resultError.push(new FieldsError("start", textEqualError, true));
            resultError.push(new FieldsError("finish", textEqualError, true));
        }
        return resultError;
    };

    /**
     * @function функция вычисляет смещение по оси ординат
     * @return {Number}
     */
    Line2d.prototype.dx = function () {
        return this.start.dx(this.finish);
    };
    /**
     * @function функция вычисляет смещение по оси абсцис
     * @return {Number}
     */
    Line2d.prototype.dy = function () {
        return this.start.dy(this.finish);
    };
    /**
     * @function проверяет лежит ли точка на прямой
     * @param point {Point2d}
     * @return {Boolean}
     */
    Line2d.prototype.onLine = function (point) {
        var error = this.a * point.x + this.b * point.y + this.c;
        return Math.abs(error) < 0.001;
    };
    /**
     * @function находит пересечения двух прямых
     * @param otherLine {Line2d}
     * @return {Point2d|null}
     */
    Line2d.prototype.getCross = function (otherLine) {
        var x, y, assertParallel;
        assertParallel = this.a * otherLine.b - this.b * otherLine.a;
        if (Math.abs(assertParallel) < 0.001) {
            return null;
        }
        x = -(this.c * otherLine.b - otherLine.c * this.b) / assertParallel;
        y = -(this.a * otherLine.c - otherLine.a * this.c) / assertParallel;
        return new Point2d({
            "x": x,
            "y": y
        });
    };
    /**
     * @function находит расстояние между точкой и прямой
     * @param point {Point2d}
     * @return {Number}
     */
    Line2d.prototype.getDistanceTo = function (point) {
        return Math.abs((this.a * point.x + this.b * point.y + this.c)
            /
            (Math.sqrt(this.a * this.a + this.b * this.b)));
    };
    /**
     * @function находит перпендикулярную линию
     * @param point {Point2d}
     * @return {Line2d}
     */
    Line2d.prototype.getNormalLine = function (point) {
        var c = this.a * point.y - this.b * point.x;
        return getFakeLine(this.b, -this.a, c);
    };
    /**
     * @function Отображает зеркльно одну линию относительно другой
     * @param mirrorLine {Line2d} линия-зеркало
     * @return {Line2d}
     */
    Line2d.prototype.getMirrorReflection = function (mirrorLine) {
        var cross = this.getCross(mirrorLine),
            normalMirrorLine = mirrorLine.getNormalLine(cross),
            parallelMirrorLine = normalMirrorLine.getNormalLine(this.start),
            focus = normalMirrorLine.getCross(parallelMirrorLine),
            finishX = 2 * focus.x - this.start.x,
            finishY = 2 * focus.y - this.start.y;
        this.finish = cross;
        return new Line2d({
            "start": cross,
            "finish": new Point2d({
                "x": finishX,
                "y": finishY
            })
        });
    };
    /**
     * @function Находит под каким углом идет прямая относительно экранных координат
     * @return {Number}
     */
    Line2d.prototype.getAbsAngle = function () {
        var toZero = this.finish.subtractWith(this.start);
        return 360 * (Math.atan2(toZero.y, toZero.x) - Math.PI / 2) / (2 * Math.PI);

    };

}(window));