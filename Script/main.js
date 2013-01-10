(function () {
    var selectNameTest = $("#selectTest"),
        nameTest = selectNameTest.val(),
        nameToPath = {
            "azproduction": "./Example/azproduction.json",
            "square": "./Example/square.json"
        },
        currentGame,
        canvas;
    $("<canvas />", {
        "id":"c"
    })
        .attr("width", document.body.offsetWidth/2)
        .attr("height", window.innerHeight)
        .attr("style","border:1px solid #ccc")
        .appendTo(document.body);
    canvas = new fabric.Canvas("c");
    var startGame = function(pathToExample) {
        $.getJSON(pathToExample, function (date) {
            var state = new PlayerState({
                "location": new Point2d({
                    "x": parseInt(date.state.location.x),
                    "y": parseInt(date.state.location.y)
                }),
                "speed": new Point2d({
                    "x": parseInt(date.state.speed.x),
                    "y": parseInt(date.state.speed.y)
                })

            });
            var points = [],
                lines = [];
            date.points.forEach(function (point) {
                points.push(new Point2d({
                    "x": parseInt(point.x),
                    "y": parseInt(point.y)
                }));
            });
            for(var i = 0; i < points.length - 1;i += 1) {
                lines.push(new Line2d({"start": points[i],"finish": points[i+1]}));
            }
            lines.push(new Line2d({"start": points[points.length - 1],"finish": points[0]}));
            if (currentGame) {
                currentGame.stop();
            }
            currentGame =new Game({
                "lines": lines,
                "state": state,
                "canvas": canvas,
                "radius": 10,
                "widthLine": 30,
                "distanceBetweenCircleAndSmallAngle": 30
            });
            currentGame.start();
        });
    };
    selectNameTest.change(function() {
        nameTest = selectNameTest.val();
        if (nameToPath[nameTest])
            startGame(nameToPath[nameTest]);
    });
    if (nameToPath[nameTest])
        startGame(nameToPath[nameTest]);

//    var currentGame =

}());