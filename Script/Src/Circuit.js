(function (toExport) {
    var Circuit = function(param) {
        toExport.Model.call(this, param);
    };
    Circuit.prototype.getAllError = function () {
        var result = [];
        if (typeof this.points === "Array") {
            result.push(new FieldsError("points","Поле не задано", true));
        }
        if (typeof this.points === "undefined") {
            result.push(new FieldsError("points","Поле не задано", true));
        }
    }
    toExport.Circuit = Circuit;
    Circuit.prototype.Draw = function() {
        var i = 0,
            currentPoint,
            nextPoint,
            circuitFromLines = [];
        if (this.points.length < 3) {
            throw new Error("Точек слишком мало");
        }
        for(; i < this.points.length - 1; i += 1) {
            currentPoint = this.points[i];
            nextPoint = this.points[i + 1];
            circuitFromLines.push(new fabric.Line([currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y]));
        }
        currentPoint = this.points[this.points.length - 1];
        nextPoint = this.points[0];
        circuitFromLines.push(new fabric.Line([currentPoint.x, currentPoint.y, nextPoint.x, nextPoint.y]));
        return circuitFromLines;
    };
}(window));