/*global
 Point2d: false,
 Line2d: false,
 PlayerState:false
 */
(function (toExport) {
    "use strict";
    var ManagerTrajectory = function (container) {
        toExport.Model.call(this, container);
    };

    ManagerTrajectory.prototype = Object.create(toExport.Model.prototype, {
        constructor: {
            value: ManagerTrajectory,
            enumerable: false,
            writable: true,
            configurable: true
        }
    });
    toExport.ManagerTrajectory = ManagerTrajectory;
    /**
     * @function найти состояния фишки сразу после столкновения
     * @param {PlayerState} previousState
     * @return {PlayerState}
     */
    ManagerTrajectory.prototype.getFutureState = function (previousState) {
        if (previousState.speed.distanceTo(Point2d.Zero) < 1) {
            return previousState;
        }
        var moveLine = new Line2d({
            "start": new Point2d({
                "x": previousState.location.x,
                "y": previousState.location.y
            }),
            "finish": new Point2d({
                "x": previousState.location.x + previousState.speed.x,
                "y": previousState.location.y + previousState.speed.y
            })
        }),
            nearestCross = this.getRealCrossWith(moveLine),
            newState,
            mirrorLine,
            speedNonNormalize,
            valueSpeedNonNormalize,
            valueSpeed;
        if (nearestCross.length === 0) {
            console.log("Чтото пошло явно не так");
            this.getRealCrossWith(moveLine)
            throw new Error();
        }
        newState = new PlayerState({
            "location": nearestCross[0].cross
        });
        if (nearestCross.length !== 1) {
            newState.speed = previousState.speed.invert();
        } else {
            mirrorLine = moveLine.getMirrorReflection(nearestCross[0].line);
            speedNonNormalize = new Point2d({
                "x": mirrorLine.dx(),
                "y": mirrorLine.dy()
            });
            valueSpeedNonNormalize = speedNonNormalize.distanceTo(Point2d.Zero);
            valueSpeed = previousState.speed.distanceTo(Point2d.Zero);
            speedNonNormalize.x = (speedNonNormalize.x / valueSpeedNonNormalize) * valueSpeed;
            speedNonNormalize.y = (speedNonNormalize.y / valueSpeedNonNormalize) * valueSpeed;
            newState.speed = speedNonNormalize;
        }
        return newState;
    };
    /**
     * Найти реальное место столкновения с учетом размера стенок и размера шара
     * @field crossLine {Line2d}
     * @return {Object}
     */
    ManagerTrajectory.prototype.getRealCrossWith = function (crossLine) {
        var nearestCross = [],
            minimalDistanceForCross = Number.POSITIVE_INFINITY,
            that = this,
            distance,
            distanceBetweenStartOfCrossLineAndLine,
            k,
            additionalPoint,
            realCross,
            projectionRealCross,
            angle;
        this.lines.forEach(function (line) {
            var cross = crossLine.getCross(line);
            if (cross === null) {
                return;
            }
            if (cross.subtractWith(crossLine.start).isCollinear(crossLine.getVector())) {
                distanceBetweenStartOfCrossLineAndLine = line.getDistanceTo(crossLine.start);
                if (distanceBetweenStartOfCrossLineAndLine < that.radiusOfCircle) {
                    return;
                }
                k =  distanceBetweenStartOfCrossLineAndLine / that.radiusOfCircle;

                realCross = new Point2d({
                    "x": crossLine.start.x + (cross.x - crossLine.start.x) * ((k - 1) / k),
                    "y": crossLine.start.y + (cross.y - crossLine.start.y) * ((k - 1) / k)
                });
                projectionRealCross = line.getNormalLine(realCross).getCross(line);
                if (!projectionRealCross.between2Point(line.start, line.finish)) {
                    //возможно мы врезались в угол
                    angle = crossLine.getDistanceTo(line.start) < crossLine.getDistanceTo(line.finish)
                        ? line.start : line.finish;
                    if (crossLine.getDistanceTo(angle) > that.radiusOfCircle) {
                        return; //нет мы не врезались в угол
                    }
                    additionalPoint = crossLine.getNormalLine(angle).getCross(crossLine);
                    k = additionalPoint.distanceTo(crossLine.start) - Math.sqrt(that.radiusOfCircle * that.radiusOfCircle - additionalPoint.distanceTo(angle) * additionalPoint.distanceTo(angle));

                    realCross = crossLine.getVector().getNormalizedVector().multiply(k).addWith(crossLine.start);
                }
                distance = crossLine.start.distanceTo(realCross);
                if (minimalDistanceForCross >= distance) {
                    if (minimalDistanceForCross !== distance) {
                        nearestCross = [];
                        minimalDistanceForCross = distance;
                    }
                    nearestCross.push({
                        "line": line,
                        "cross": realCross
                    });
                }
            }
        });
        return nearestCross;
    };
}(window));