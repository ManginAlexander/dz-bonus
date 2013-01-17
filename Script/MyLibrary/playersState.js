/*global
Point2d: false
 */
(function (toExport) {
    "use strict";
    /**
     * @class состояние фишки
     * @param container
     * @field {Point2d} location положение
     * @field {Point2d} speed вектор скорости
     * @constructor
     */
    var PlayerState = function (container) {
        toExport.Model.call(this, container);
        this.speed = container.speed || Point2d.Zero.copy();
        this.location = container.location || Point2d.Zero.copy();
    };
    PlayerState.prototype =  Object.create(toExport.Point2d.prototype, {
        constructor: {
            value: PlayerState,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });

    toExport.PlayerState = PlayerState;

    /**
     * Функция находит промежуточные точки между 2 состояниями
     * @param otherState {PlayerState}
     * @return {Array}
     */
    PlayerState.prototype.getDiffs = function (otherState) {
        var diff = [],
            currentPoint = new Point2d({
                "x": this.location.x + this.speed.x,
                "y": this.location.y + this.speed.y
            });
        while (currentPoint.between2Point(this.location, otherState.location)) {
            diff.push(new Point2d({
                "x": currentPoint.x,
                "y": currentPoint.y
            }));
            currentPoint.x += this.speed.x;
            currentPoint.y += this.speed.y;
        }
        diff.push(new Point2d({
            "x": otherState.location.x,
            "y": otherState.location.y
        }));
        return diff;
    };
    /**
     * равны ли два состояния
     * @param otherState {PlayerState}
     * @return {Boolean}
     */
    PlayerState.prototype.equal = function (otherState) {
        return Math.abs(this.location.getDistanceTo(otherState.location) + this.speed.getDistanceTo(otherState.speed)) < 1;
    };
    /**
     * Находится ли фишка в состоянии покоя
     * @return {Boolean}
     */
    PlayerState.prototype.isStay = function () {
        return Math.abs(this.speed.getVectorLength()) < 1;
    };
    /**
     * @function посчитать следующее положение фишки
     * @return {Point2d}
     */
    PlayerState.prototype.getNextLocation = function () {
        return this.location.addWith(this.speed);
    };
    PlayerState.prototype.toString = function () {
        return "Loc:" + this.location + ";Speed:" + this.speed;
    };
}(window));