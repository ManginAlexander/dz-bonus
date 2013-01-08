(function (toExport) {
    /**
     *
     * @param container
     * @field {Point2d} location
     * @field {Point2d} speed
     * @constructor
     */

    var PlayerState = function(container) {
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
    PlayerState.prototype.getDiffs = function (otherState) {
      var diff = [],
          currentPoint = new Point2d(
              {
                "x":this.location.x + this.speed.x,
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
    PlayerState.prototype.equal = function (otherState) {
        return Math.abs(this.location.distanceTo(otherState.location) + this.speed.distanceTo(otherState.speed)) < 1;
    };
    toExport.PlayerState = PlayerState;

}(window));