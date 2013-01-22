/*global
 Point2d: false,
 Line2d: false,
 PlayerState:false
 */
(function (toExport) {
    "use strict";
    /**
     * Находит пересечение между направленной прямой и
     * @param beam {Line2d}
     * @param line {Line2d
     * @return {Boolean}
     */
    var existsCrossBetweenBeamWithLine = function (beam, line) {
            var cross = beam.getCross(line),
                vectorCross;
            if (cross === null) {
                return false;
            }
            vectorCross = cross.subtractWith(beam.start);
            return vectorCross.isCollinear(beam.getVector());
        },
        /**
         * Пересекает ли линия окружность
         * @param center {Point2d} центр окружности
         * @param radius {Number} радиус окружности
         * @param line {Line2d} прямая
         * @return {Boolean}
         */
        isCircleOnLine = function (center, radius, line) {
            return line.getDistanceTo(center) < radius;
        },
        isCircleTangentOnLine = function (center, line) {
            var projectionCenterOnLine = line.getNormalLine(center).getCross(line);
            return projectionCenterOnLine.between2Point(line.start, line.finish);
        },
        getCrossCircleCrossAndLinesAngle = function (center, radius, movementLine, line) {
            var angle = movementLine.getDistanceTo(line.start) < movementLine.getDistanceTo(line.finish)
                    ? line.start : line.finish,
                distanceBetweenAngleAndPrevLocCircle;
            if (movementLine.getDistanceTo(angle) > radius) {
                return null;
            }
            distanceBetweenAngleAndPrevLocCircle = center.getDistanceTo(angle);
            return movementLine.getPoint(center, distanceBetweenAngleAndPrevLocCircle - radius);
        },
        getNearestCross = function (currentLoc, linesAndCrosses) {
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
        },
        ManagerTrajectory = function (container) {
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
            newState = new PlayerState({}),
            mirrorLine;
        if (nearestCross.length === 0) {
            console.log("Чтото пошло явно не так");
            newState.speed = previousState.speed.invert();
            newState.location = previousState.location;
            return newState;
        }
        newState = new PlayerState({
            "location": nearestCross[0].cross
        });
        if (nearestCross.length !== 1) {
            newState.speed = previousState.speed.invert();
        } else {
            mirrorLine = moveLine.getMirrorReflection(nearestCross[0].line).getVector().getNormalizedVector().multiply(previousState.speed.getVectorLength());
            newState.speed = mirrorLine;
        }
        return newState;
    };

    /**
     * Найти все возможные столкновения фишки при учете что есть только одна стенка.
     * @param movementLine {Line2d}
     * @return {Array}
     */
    ManagerTrajectory.prototype.getAllCrossWithWalls = function (movementLine) {
        var that = this;
        return this.lines.map(function (line) {
            if (!existsCrossBetweenBeamWithLine(movementLine, line) ||  isCircleOnLine(movementLine.start, that.radiusOfCircle, line)) {
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