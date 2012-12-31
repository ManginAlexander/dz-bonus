(function(toExport) {
    /**
     * @class моделирует линию в двумерном пространстве
     * @param  start {Point2d} начальная точка отрезка
     * @param  finish {Point2d} конечная точка отрезка
     * @field  start {Point2d} конечная точка отрезка
     * @field  finish {Point2d} конечная точка отрезка
     * @field  a {Number} коэффицент в уравнении прямой
     * @field  b {Number} коэффицент в уравнении прямой
     * @field  c {Number} коэффицент в уравнении прямой
     * @constructor
     */
    var Line2d = function(start, finish) {
        this.start = start;
        this.finish = finish;
        this.a = -this.dy();
        this.b = this.dx();
        this.c = start.x * finish.y - finish.x * start.y;
    };
    toExport.Line2d = Line2d;
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
    Line2d.prototype.onLine = function (point) {
        var error = this.a*point.x + this.b*point.y + this.c;
        return Math.abs(error)<0.001;
    };
    Line2d.prototype.getCross = function (otherLine) {
        var x, y, assertParallel;
        assertParallel = this.a*otherLine.b - this.b*otherLine.a;
        if (Math.abs(assertParallel) < 0.001) {
            return null;
        }
        x = -(this.c*otherLine.b - otherLine.c*this.b)/assertParallel;
        y = -(this.a*otherLine.c - otherLine.a*this.c)/assertParallel;
        return new Point2d(x, y);
    };
    Line2d.prototype.getNormalLine = function (point) {
        var c = this.a * point.y - this.b * point.x;
        return getFakeLine(this.b, -this.a, c);
    };
    Line2d.prototype.getMirrorReflection = function (mirrorLine) {
        var cross = this.getCross(mirrorLine);
        this.finish = cross;
        var normalMirrorLine = this.getNormalLine(cross);
        var parallelMirrorLine = normalMirrorLine.getNormalLine(this.start);
        var focus = normalMirrorLine.getCross(parallelMirrorLine);
        var finishX = 2*focus.x - this.start.x;
        var finishY = 2*focus.y - this.start.y;
        return new Line2d(cross, new Point2d(finishX, finishY));
    };
    var getFakeLine = function(a,b,c) {
        var line = new Line2d(new Point2d(0, 0), new Point2d(1, 1));
        line.a = a;
        line.b = b;
        line.c = c;
        return line;
    };
}(window));