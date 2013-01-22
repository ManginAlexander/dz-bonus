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

        this.circle = new fabric.Circle({
            "left": this.state.location.x,
            "top": this.state.location.y,
            "radius": this.radius
        });
        this.circle.setGradientFill({
            x1: 0,
            y1: 0,
            x2: 0,
            y2: this.circle.height,
            colorStops: {
                0: '#a6cbfb',
                1: '#5495d3'
            }
        });
        this.circle.set({ strokeWidth: 1, stroke: 'rgba(33,127,213,1)' });
        this.circle.hasBorders = this.circle.hasControls = false;
        this.circle.lockMovementX = this.circle.lockMovementY = true;
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
        this.last = new Point2d({"x": 0, "y": 0});
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
        var that = this,
            arrow = null;

        this.canvas.on('mouse:down', function (e) {
            if (e.target === that.circle) {
                that.isChangeMoveVector = true;
            }
        });
        this.canvas.on('mouse:up', function () {
            that.isChangeMoveVector = false;
            if (arrow) {
                that.canvas.remove(arrow);
                arrow = null;
            }
        });
        this.canvas.on('mouse:move', function (e) {
            var currentMouseLocation = new Point2d({"x": e.e.offsetX, "y": e.e.offsetY}),
                line = new Line2d({
                    "start": currentMouseLocation,
                    "finish": that.last
                }),
                projectionCenterCircle = line.getNormalLine(that.state.location).getCross(line);
            if (projectionCenterCircle !== null && projectionCenterCircle.between2Point(currentMouseLocation, that.last) &&  projectionCenterCircle.getDistanceTo(that.state.location) <= that.circle.radius) {

                that.changeMoveVector(new Point2d({
                    "x": currentMouseLocation.x - that.last.x,
                    "y": currentMouseLocation.y - that.last.y
                }));
            }
            that.last = currentMouseLocation;
        });
        this.animateAll();
    };
    /**
     * Функция отвечает за перерисовку игры
     */
    Game.prototype.animateAll  = function () {
        var that = this,
            frequencyUpdate = 100,
            nextState,
            pointOnCircle,
            k,
            normVector;
        if (!this.isAnimate) {
            return;
        }
        setTimeout(function animate() {
            if (!that.isChangeMoveVector) {
                if (that.state.isStay()) {
                    setTimeout(animate, frequencyUpdate);
                    return;
                }
                if (that.queueMove.length === 0) {
                    nextState = that.manager.getFutureState(that.state);
                    that.queueMove = that.state.getDiffs(nextState);
                    k = that.circle.radius + that.checkPointsContainer.distanceBetweenCheckPoint;
                    normVector = nextState.location.subtractWith(that.state.location).getNormalizedVector();
                    pointOnCircle = that.state.location.addWith(normVector.multiply(k));
                    that.checkPointsContainer.clear();
                    if (pointOnCircle.getDistanceTo(nextState.location) >= that.circle.radius + that.checkPointsContainer.distanceBetweenCheckPoint) {
                        that.checkPointsContainer.adds(pointOnCircle, nextState.location);
                    }
                }
                that.state.location = that.queueMove.shift();
                normVector = nextState.location.subtractWith(that.state.location).getNormalizedVector();
                pointOnCircle = that.state.location.addWith(normVector.multiply(k));
                that.checkPointsContainer.removeLessOrEqualThan(pointOnCircle);
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