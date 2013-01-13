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
        return Math.abs(this.location.distanceTo(otherState.location) + this.speed.distanceTo(otherState.speed)) < 1;
    };
    PlayerState.prototype.toString = function () {
        return "Loc:" + this.location + ";Speed:" + this.speed;
    };
}(window));