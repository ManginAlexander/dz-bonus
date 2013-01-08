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
    var lines = [
        new Line2d({
            "start": new Point2d({
                "x": 0,
                "y": 0
            }),
            "finish": new Point2d({
                "x": 0,
                "y":1000
            })
        }),
        new Line2d({
            "start": new Point2d({
                "x": 0,
                "y":1000
            }),
            "finish": new Point2d({
                "x": 1000,
                "y": 1000
            })
        }),
        new Line2d({
            "start": new Point2d({
                "x": 1000,
                "y": 1000
            }),
            "finish": new Point2d({
                "x": 1000,
                "y": 0
            })
        }),
        new Line2d({
            "start": new Point2d({
                "x": 1000,
                "y": 0
            }),
            "finish": new Point2d({
                "x": 0,
                "y": 0
            })
        })
    ];
    lines.forEach(function(line) {
        canvas.add(new fabric.Line([line.start.x, line.start.y, line.finish.x, line.finish.y]));
    });
    var circle = new fabric.Circle({
        "left": 500,
        "top": 0,
        "radius": 30
    });
    canvas.add(circle);
    var managerTrajectory = new ManagerTrajectory({
        "lines": lines,"radiusOfCircle": 30});
    var state = new PlayerState({
        "location": new Point2d({
            "x": 100,
            "y": 100
        }),
        "speed": new Point2d({
            "x": 25,
            "y": -25
        })
    });
    var queueMove = [];
    setTimeout(function animate() {
        if (queueMove.length == 0) {
            var newState = managerTrajectory.getFutureState(state);
            queueMove = state.getDiffs(newState);
            state = newState;
        }
        state.location = queueMove.shift();
        circle.left =state.location.x;
        circle.top =state.location.y;
        canvas.renderAll();
        setTimeout(animate, 100);
    }, 10);
}());