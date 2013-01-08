(function(toExport){
    "use strict";
    var ManagerTrajectory = function(container) {
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
     *
     * @param {PlayerState} previousState
     * @return {*}
     */
    ManagerTrajectory.prototype.getFutureState = function(previousState) {
        if (previousState.speed.distanceTo(Point2d.Zero) < 1)
        {
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
        });
        var nearestCross = this.getRealCrossWith(moveLine);
        if (nearestCross.length == 0) {
            console.log("Чтото пошло явно не так");
            throw new Error();
        }
        var cross = moveLine.getCross((nearestCross[0]));
        var newState = new PlayerState({
            "location": cross
        });
        if (nearestCross.length != 1) {
            newState.speed = previousState.speed.invert();
        }
        else {
            var mirrorLine = moveLine.getMirrorReflection(nearestCross[0]),
                speedNonNormalize = new Point2d({
                    "x": mirrorLine.dx(),
                    "y": mirrorLine.dy()
                }),
                valueSpeedNonNormalize = speedNonNormalize.distanceTo(Point2d.Zero),
                valueSpeed = previousState.speed.distanceTo(Point2d.Zero);
            speedNonNormalize.x = (speedNonNormalize.x / valueSpeedNonNormalize) * valueSpeed;
            speedNonNormalize.y = (speedNonNormalize.y / valueSpeedNonNormalize) * valueSpeed;
            newState.speed = speedNonNormalize;
        }
        return newState;
    };
    /**
     * crossLine {Line2d}
     */
    ManagerTrajectory.prototype.getRealCrossWith = function(crossLine) {
        var nearestCross = [];
        var minimalDistanceForCross = Number.POSITIVE_INFINITY;
        this.lines.forEach(function(line) {
            var cross = crossLine.getCross(line);
            if (cross === null) {
                return;
            }
            if (cross.between2Point(crossLine.start, crossLine.finish) ||
                crossLine.finish.between2Point(crossLine.start, cross)) {
                var distance = crossLine.start.distanceTo(cross);
                if (distance < 1) {
                    return;
                }
                if (minimalDistanceForCross >= distance )
                {
                    if (minimalDistanceForCross != distance) {
                        nearestCross = [];
                        minimalDistanceForCross = distance
                    }
                    nearestCross.push(line);
                }
            }
        });
        return nearestCross;
    };
}(window));