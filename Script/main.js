/*global
 fabric: false,
 $: false,
 PlayerState: false,
 Point2d: false,
 Game:false,
 Line2d: false
 */
(function () {
    "use strict";
    var selectNameTest = $("#selectTest"),
        nameTest = selectNameTest.val(),
        nameToPath = {
            "azproduction": "./Script/Example/azproduction.json",
            "square": "./Script/Example/square.json"
        },
        currentGame,
        canvas,
        startGame;
    $("<canvas />", {
        "id": "c"
    })
        .attr("width", document.body.offsetWidth / 2)
        .attr("height", window.innerHeight)
        .attr("style", "border:1px solid #ccc")
        .appendTo(document.body);
    canvas = new fabric.Canvas("c");
    startGame = function (pathToExample) {
        $.getJSON(pathToExample, function (date) {
            var state = new PlayerState({
                "location": new Point2d({
                    "x": parseInt(date.state.location.x, 10),
                    "y": parseInt(date.state.location.y, 10)
                }),
                "speed": new Point2d({
                    "x": parseInt(date.state.speed.x, 10),
                    "y": parseInt(date.state.speed.y, 10)
                })

            }),
                points = [],
                lines = [],
                i;
            date.points.forEach(function (point) {
                points.push(new Point2d({
                    "x": parseInt(point.x, 10),
                    "y": parseInt(point.y, 10)
                }));
            });
            for (i = 0; i < points.length - 1; i += 1) {
                lines.push(new Line2d({"start": points[i], "finish": points[i + 1]}));
            }
            lines.push(new Line2d({"start": points[points.length - 1], "finish": points[0]}));
            if (currentGame) {
                currentGame.stop();
            }
            var averagePoint = new Point2d({"x": 0, "y": 0});
            points.forEach(function (point) {
                averagePoint = averagePoint.addWith(point);
            });
            averagePoint = averagePoint.multiply(1 / points.length);
            canvas.add(new fabric.Text("Push ME!!!", {
                strokeStyle: '#ff1318',
                "top": averagePoint.y + 100,
                "left": averagePoint.x,
                "fill": "white",
                strokeWidth: 2
            }));

            currentGame = new Game({
                "lines": lines,
                "state": state,
                "canvas": canvas,
                "radius": 20,
                "widthLine": 30,
                "distanceBetweenCircleAndSmallAngle": 30
            });
            $("#StayChip").on("click", function () {
                currentGame.stay();
            });
            currentGame.start();
        });
    };
    selectNameTest.change(function () {
        nameTest = selectNameTest.val();
        if (nameToPath[nameTest]) {
            startGame(nameToPath[nameTest]);
        }
    });
    if (nameToPath[nameTest]) {
        startGame(nameToPath[nameTest]);
    }


}());