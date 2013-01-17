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
        if (previousState.isStay()) {
            return previousState;
        }
        var moveLine = new Line2d({
                "start": previousState.location.copy(),
                "finish": previousState.getNextLocation()
            }),
            nearestCross = getNearestCross(previousState.location, this.getAllCrossWithWalls(moveLine)),
            newState,
            mirrorLine,
            speedNonNormalize,
            valueSpeedNonNormalize,
            valueSpeed;
        if (nearestCross.length === 0) {
            console.log("Чтото пошло явно не так");
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
            valueSpeedNonNormalize = speedNonNormalize.getDistanceTo(Point2d.Zero);
            valueSpeed = previousState.speed.getDistanceTo(Point2d.Zero);
            speedNonNormalize.x = (speedNonNormalize.x / valueSpeedNonNormalize) * valueSpeed;
            speedNonNormalize.y = (speedNonNormalize.y / valueSpeedNonNormalize) * valueSpeed;
            newState.speed = speedNonNormalize;
        }
        return newState;
    };
    ManagerTrajectory.prototype.getCrossLineAndMovingCircle = function (line, movementLine) {
    };
    var existsCrossBetweenBeamWithSegment = function (beam, line) {
        var cross = beam.getCross(line),
            vectorCross;
        if (cross === null) {
            return false;
        }
        vectorCross = cross.subtractWith(beam.start);
        return vectorCross.isCollinear(beam.getVector());
    };
    var isCircleOnLine = function (center, radius, line) {
        return line.getDistanceTo(center) < radius;
    };
    var isCircleTangentOnLine = function (center, line) {
        var projectionCenterOnLine = line.getNormalLine(center).getCross(line);
        return projectionCenterOnLine.between2Point(line.start, line.finish);
    };
    var getCrossCircleCrossAndLinesAngle = function (center, radius, movementLine, line) {
        var angle = movementLine.getDistanceTo(line.start) < movementLine.getDistanceTo(line.finish)
            ? line.start : line.finish,
            distanceBetweenAngleAndPrevLocCircle;
        if (movementLine.getDistanceTo(angle) > radius) {
            return null;
        }
        distanceBetweenAngleAndPrevLocCircle = center.getDistanceTo(angle);
        return movementLine.getPoint(center, distanceBetweenAngleAndPrevLocCircle - radius);
    };
    var getNearestCross = function (currentLoc, linesAndCrosses) {
        var nearestCrosses = [],
            minDistance = Number.MAX_VALUE;
        linesAndCrosses.forEach(function (lineAndCross) {
            var distance = lineAndCross.cross.getDistanceTo(currentLoc);
            if (distance > minDistance) {
                return;
            }
            if (distance === minDistance) {
                nearestCrosses.push(lineAndCross);
            } else {
                nearestCrosses = [lineAndCross];
                minDistance = distance;
            }
        });
        return nearestCrosses;
    };
    /**
     * Найти все возможные столкновения фишки при учете что есть только одна стенка.
     * @param movementLine {Line2d}
     * @return {Array}
     */
    ManagerTrajectory.prototype.getAllCrossWithWalls = function (movementLine) {
        var that = this;
        return this.lines.map(function (line) {
            if (!existsCrossBetweenBeamWithSegment(movementLine, line) ||  isCircleOnLine(movementLine.start, that.radiusOfCircle, line)) {
                return null;
            }
            var distanceBetweenPreviousLocAndLinesCross = movementLine.getCross(line).getDistanceTo(movementLine.start),
                distanceBetweenPreviousLocCircleAndLine = line.getDistanceTo(movementLine.start),
                realCross = movementLine.getPoint(movementLine.start, distanceBetweenPreviousLocAndLinesCross * (1 - that.radiusOfCircle / distanceBetweenPreviousLocCircleAndLine));
            if (!isCircleTangentOnLine(realCross, line)) {
                //возможно мы врезались в угол
                realCross = getCrossCircleCrossAndLinesAngle(realCross, that.radiusOfCircle, movementLine, line);
            }
            return {
                "cross": realCross,
                "line": line
            };
        }).filter(function (el) {
            return el !== null  && el.cross !== null;
        });
    };
}(window));