/*global
 fabric: false,
 ManagerTrajectory: false,
 CheckPointContainer: false,
 Point2d: false,
 Line2d:false
 */
(function (toExport) {
    "use strict";
    /**
     * @class содержит в себе весь мир игры
     * @param container
     * @field circle {fabric.Circle} игровая фишка
     * @field manager {ManagerTrajectory} алгоритм осуществляющий столкновения со стенками
     * @field queueMove {Array} очередь движений фишки до следующего столкновения
     * @field checkPointsContainer {CheckPointContainer} контейнер, содержащий check point фишки
     * @field isChangeMoveVector {Boolean} флаг, показывающий что пользователь изменяет направление фишки
     * @field isAnimate {Boolean} флаг, выключающий анимацию
     * @constructor
     */
    var Game = function (container) {
        var that = this,
            points = [];

        toExport.Model.call(this, container);
        this.lines.forEach(function (line) {
            points.push(line.start);
        });
        points.push(this.lines[0].start);
        this.canvas.add(new fabric.Polyline(points, {
            "stroke": 'rgba(81,81,81,1)',
            "fill": 'rgba(33,127,213,0)',
            "strokeWidth": that.widthLine,
            "hasControls": false,
            "hasBorders": false,
            "lockMovementX": true,
            "lockMovementY": true
        }));
        this.circle = new fabric.Chip({
            "x": this.state.location.x,
            "y": this.state.location.y,
            "radius": this.radius
        });
        this.canvas.add(this.circle);

        this.manager = new ManagerTrajectory({
            "lines": this.lines,
            "radiusOfCircle": this.circle.radius + this.widthLine / 2
        });
        this.queueMove = [];
        this.checkPointsContainer = new CheckPointContainer({
            "canvas": this.canvas,
            "radius": this.radius / 3
        });
        this.isChangeMoveVector = false;
        this.isAnimate = true;
        this.previousMouseLocation = null;
    };

    Game.prototype = Object.create(toExport.Model.prototype, {
        constructor: {
            value: Game,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    toExport.Game = Game;
    /**
     * @function запускает игру
     */
    Game.prototype.start = function () {
        var that = this;
        this.canvas.on('mouse:move', function (e) {
            var currentMouseLocation = new Point2d({
                "x": e.e.offsetX,
                "y": e.e.offsetY
            }),
                mouseLine,
                projectionCenterCircle;
            if (that.previousMouseLocation === null) {
                that.previousMouseLocation = currentMouseLocation;
                return;
            }
            mouseLine = new Line2d({
                "start": currentMouseLocation,
                "finish": that.previousMouseLocation
            });
            projectionCenterCircle = mouseLine.getNormalLine(that.state.location).getCross(mouseLine);
            if (projectionCenterCircle !== null && projectionCenterCircle.between2Point(currentMouseLocation, that.previousMouseLocation) &&
                    projectionCenterCircle.getDistanceTo(that.state.location) <= that.circle.radius) {
                that.changeMoveVector(currentMouseLocation.subtractWith(that.previousMouseLocation));
            }
            that.previousMouseLocation = currentMouseLocation;
        });
        this.animateAll();
    };
    /**
     * Функция отвечает за перерисовку игры
     */
    Game.prototype.animateAll  = function () {
        var that = this,
            frequencyUpdate = 100,
            nextState;
        if (!this.isAnimate) {
            return;
        }
        setTimeout(function animate() {
            if (that.state.isStay()) {
                that.circle.animate('radius', 0.7 * that.radius, {
                    onChange: that.canvas.renderAll.bind(that.canvas),
                    onComplete: function () {
                        that.circle.animate('radius', that.radius, {
                            onChange: that.canvas.renderAll.bind(that.canvas),
                            duration: 4 * frequencyUpdate
                        });
                    },
                    duration: 4 * frequencyUpdate
                });
            }
            setTimeout(animate, 10 * frequencyUpdate);
        }, 10 * frequencyUpdate);
        setTimeout(function animate() {
            if (!that.isChangeMoveVector) {
                if (that.state.isStay()) {
                    setTimeout(animate, frequencyUpdate);
                    return;
                }
                if (that.queueMove.length === 0) {
                    nextState = that.manager.getFutureState(that.state);
                    that.queueMove = that.state.getDiffs(nextState);

                    that.checkPointsContainer.clear();
                    if (that.state.location.getDistanceTo(nextState.location) >= that.checkPointsContainer.minDistanceForPath) {
                        that.checkPointsContainer.adds(that.state.location, nextState.location);
                    }
                }
                that.state.location = that.queueMove.shift();
                that.checkPointsContainer.removePreviousCheckPoint(that.state.location);
                that.circle.animate('left', that.state.location.x, {
                    onChange: that.canvas.renderAll.bind(that.canvas),
                    duration: frequencyUpdate
                })
                    .animate("top", that.state.location.y, {
                        onChange: that.canvas.renderAll.bind(that.canvas),
                        duration: frequencyUpdate
                    });
                if (that.queueMove.length === 0) {
                    that.state.speed = nextState.speed;

                }
            }

            if (that.isAnimate) {
                setTimeout(animate, frequencyUpdate);
            }
        }, frequencyUpdate);
    };
    /**
     * @function Смена направления
     * @param newSpeed {Point2d} новый вектор скорости
     */
    Game.prototype.changeMoveVector = function (newSpeed) {
        this.state.speed = newSpeed;
        this.queueMove = [];
        this.checkPointsContainer.clear();
    };
    /**
     * @function Остановить игру
     */
    Game.prototype.stop = function () {
        this.isChangeMoveVector = false;
        this.isAnimate = false;
        this.canvas.clear();
    };
}(window));