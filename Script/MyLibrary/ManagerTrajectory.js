/*global
 Point2d: false,
 Line2d: false,
 Circle2d: false,
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
            movingCircle = new Circle2d({
                "radius": this.radiusOfCircle,
                "center": previousState.location
            }),
            nearestCross = getNearestCross(previousState.location, this.getAllCrossWithWalls(movingCircle, moveLine)),
            speed,
            location;

        if (nearestCross.length === 0) {
            speed = previousState.speed.invert();
            location = previousState.location;
        } else {
            location = nearestCross[0].cross;
            if (nearestCross.length !== 1) {
                speed = previousState.speed.invert();
            } else {
                speed = moveLine.getMirrorReflection(nearestCross[0].line).getVector().getNormalizedVector().multiply(previousState.speed.getVectorLength());
            }
        }
        return new PlayerState({
            "speed": speed,
            "location": location
        });
    };

    /**
     * Найти все возможные столкновения фишки при учете что есть только одна стенка.
     * @param movingCircle {Circle2d}
     * @param movementLine {Line2d}
     * @return {Array}
     */
    ManagerTrajectory.prototype.getAllCrossWithWalls = function (movingCircle, movementLine) {
        var that = this;
        return this.lines.map(function (line) {
            if (!existsCrossBetweenBeamWithLine(movementLine, line) ||  movingCircle.onLine(line)) {
                return {
                    "cross": null,
                    "line": line
                };
            }
            var distanceBetweenPreviousLocAndLinesCross = movementLine.getCross(line).getDistanceTo(movementLine.start),
                distanceBetweenPreviousLocCircleAndLine = line.getDistanceTo(movementLine.start),
                newCircle = new Circle2d({
                    "center": movementLine.getPoint(movementLine.start, distanceBetweenPreviousLocAndLinesCross * (1 - that.radiusOfCircle / distanceBetweenPreviousLocCircleAndLine)),
                    "radius": that.radiusOfCircle
                });
            if (!newCircle.onSegment(line)) {
                //возможно мы врезались в угол
                newCircle.center = newCircle.getCrossWithSegmentsAngles(movementLine, line);
            }
            return {
                "cross": newCircle.center,
                "line": line
            };
        }).filter(function (el) {
            return el.cross !== null;
        });
    };
}(window));