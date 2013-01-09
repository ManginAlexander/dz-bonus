(function () {
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
        ],
        state = new PlayerState({
            "location": new Point2d({"x":100, "y":100}),
            "speed": new Point2d({"x":25, "y":35})
        });
    new Game({"lines": lines, "state": state}).start();
}());