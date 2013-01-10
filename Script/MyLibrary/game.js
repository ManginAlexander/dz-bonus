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
        var that = this;
        toExport.Model.call(this, container);

        this.lines.forEach(function (line) {
            var angle = line.getAbsAngle(),
                middle = line.start.addWith(line.finish).multiply(0.5);
            that.canvas.add(new fabric.Rect({
                "left": middle.x,
                "top": middle.y,
                "width": that.widthLine,
                "height": line.start.distanceTo(line.finish),
                "angle": angle
            }));
        });

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
            arrow = null,
            heightArrow = 30;

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
            if (!that.isChangeMoveVector) {
                return;
            }
            var mousePoint = new Point2d({"x": e.e.x, "y": e.e.y}),
                distance = that.state.location.distanceTo(mousePoint) - that.circle.radius - that.distanceBetweenCircleAndSmallAngle,
                k,
                vector,
                angle;
            console.log(distance);
            if (distance < 0) {
                that.canvas.remove(arrow);
                arrow = null;
            }
            if (distance >= 0) {
                vector = mousePoint.subtractWith(that.state.location).getNormalizedPoint();
                k = (that.circle.radius + that.distanceBetweenCircleAndSmallAngle + (heightArrow) / 2 + distance / 4);
                angle = new Line2d({
                    "finish": mousePoint,
                    "start": that.state.location
                })
                    .getAbsAngle();
                if (arrow === null) {
                    arrow = new fabric.Arrow({
                        "arrowHeight": heightArrow,
                        "arrowWidth": that.circle.radius,
                        "bodyWidth": that.circle.radius / 3,
                        fill: 'rgba(206,102,95,1)'
                    });
                    arrow.set({ strokeWidth: 1, stroke: 'rgba(165,87,83,1)' });
                    that.canvas.add(arrow);
                }
                arrow.set("left", that.state.location.x + k * vector.x)
                    .set("top", that.state.location.y + k * vector.y)
                    .set("angle", angle)
                    .setBodyHeight(distance / 2);
                that.canvas.renderAll();
                that.changeMoveVector(vector.multiply(-Math.sqrt(distance)));
            }
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
                if (that.queueMove.length === 0) {
                    nextState = that.manager.getFutureState(that.state);
                    that.queueMove = that.state.getDiffs(nextState);
                    k = that.circle.radius + that.checkPointsContainer.distanceBetweenCheckPoint;
                    normVector = nextState.location.subtractWith(that.state.location).getNormalizedPoint();
                    pointOnCircle = that.state.location.addWith(normVector.multiply(k));
                    that.checkPointsContainer.clear();
                    if (pointOnCircle.distanceTo(nextState.location) >= that.circle.radius + that.checkPointsContainer.distanceBetweenCheckPoint) {
                        that.checkPointsContainer.adds(pointOnCircle, nextState.location);
                    }
                }
                that.state.location = that.queueMove.shift();
                normVector = nextState.location.subtractWith(that.state.location).getNormalizedPoint();
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