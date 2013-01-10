(function(toExport){
    "use strict";
    var CheckPointContainer = function (container) {
        this.graphicCheckPoints = [];
        this.checkPoints = [];

        this.radius = 10;
        this.distanceBetweenCheckPoint = this.radius*2 ;
        toExport.Model.call(this, container);
    };
    toExport.CheckPointContainer = CheckPointContainer;
    CheckPointContainer.prototype.clear = function () {
        this.checkPoints = [];
        this.graphicCheckPoints.forEach(function (checkPoint) {
            checkPoint.canvas.remove(checkPoint);
        });
        this.graphicCheckPoints = [];
    };
    CheckPointContainer.prototype.adds = function (start, end) {
        var middle,
            that = this;
        this.start = start;
        this.end = end;
        this.getsDiff(start, end)
            .forEach(function(checkPoint) {
            that.createCheckPoint(checkPoint);
        });
    };
    CheckPointContainer.prototype.getsDiff = function (start, end){
        var left,
            right,
            middle = start.addWith(end).multiply(1/2);
        if (start.distanceTo(end) > 2*this.distanceBetweenCheckPoint) {
            left = this.getsDiff(start, middle);
            right = this.getsDiff(middle, end);
            return left.concat(right);
        } else
        {
            return [middle];
        }
    };
    CheckPointContainer.prototype.removeLessOrEqualThan = function (point) {
        while (this.checkPoints.length !== 0 && this.checkPoints[0].between2Point(this.start, point)) {
            var graphicCheckPoint = this.graphicCheckPoints.shift();
            this.checkPoints.shift();
            graphicCheckPoint.canvas.remove(graphicCheckPoint);
        }
    };
    CheckPointContainer.prototype.createCheckPoint = function (point) {
        var circle = new toExport.fabric.Circle({
            "radius": this.radius,
            "left": point.x,
            "top": point.y,
            "fill": "red"
        });
        this.canvas.add(circle);
        this.graphicCheckPoints.push(circle);
        this.checkPoints.push(point);
    }

}(window));