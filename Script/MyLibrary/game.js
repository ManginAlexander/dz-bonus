(function(toExport){

    var Game = function (container) {
        var that = this;
        toExport.Model.call(this, container);
        var el = $("<canvas />", {
            "id":"c"
        })
            .attr("width", document.body.offsetWidth)
            .attr("height", window.innerHeight)
            .attr("style","border:1px solid #ccc")
            .appendTo(document.body);
        this.canvas = new fabric.Canvas("c");
        this.lines.forEach(function(line) {
            that.canvas.add(new fabric.Line([line.start.x, line.start.y, line.finish.x, line.finish.y]));
        });
        this.circle = new fabric.Circle({
            "left": this.state.location.x,
            "top": this.state.location.y,
            "radius": 30
        });
        this.canvas.add(this.circle);
        this.manager = new ManagerTrajectory({
            "lines": this.lines,
            "radiusOfCircle": this.circle.radius
        });
        this.queueMove = [];
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
    Game.prototype.start = function ()
    {

        var frequencyUpdate = 100,
            that = this;

        setTimeout(function animate() {
            if (that.queueMove.length == 0) {
                var newState = that.manager.getFutureState(that.state);
                that.queueMove = that.state.getDiffs(newState);
                that.state = newState;
            }
            that.state.location = that.queueMove.shift();
            that.circle.animate('left', that.state.location.x, {
                onChange: that.canvas.renderAll.bind(that.canvas),
                duration: frequencyUpdate
            }).animate("top", that.state.location.y, {
                    onChange: that.canvas.renderAll.bind(that.canvas),
                    duration: frequencyUpdate});
            setTimeout(animate, frequencyUpdate);
        }, 100);
    }
}(window));