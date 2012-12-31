(function () {
    function initCanvas () {
        //todo Заменить на шаблонизатор
        var el = $("<canvas />", {
            "id":"c"
        })
            .attr("width", document.body.offsetWidth)
            .attr("height", window.innerHeight)
            .attr("style","border:1px solid #ccc")
            .appendTo(document.body);
        return new fabric.Canvas("c");
    }
    var canvas = initCanvas();
    var circuit = {"points":[
        {"x":0,"y":0},
        {"x":100,"y":0},
        {"x":100,"y":100}
    ]};
    var lines = new Circuit(circuit);
    lines.Draw().forEach(function (line) {
        canvas.add(line);
    });
    var circle = new fabric.Circle({
        "left": 10,
        "right": 10,
        radius: 30
    })
    canvas.add(circle);
}());