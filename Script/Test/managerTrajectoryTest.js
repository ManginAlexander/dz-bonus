ManagerTrajectoryTest = TestCase("ManagerTrajectory's on ABCD square Test", {
    "setUp": function () {
        var square;
        this.Dots = {
            "a": new Point2d({
                    "x": 0,
                    "y": 0
            }),
            "middleAB": new  Point2d({
                "x": 0,
                "y": 50
            }),
            "b": new  Point2d({
                "x": 0,
                "y": 100
            }),
            "middleBC": new  Point2d({
                "x": 50,
                "y": 100
            }),
            "c": new Point2d({
                "x": 100,
                "y": 100
            }),
            "middleCD": new  Point2d({
                "x": 100,
                "y": 50
            }),
            "d": new Point2d({
                "x": 100,
                "y": 0
            }),
            "middleDA": new  Point2d({
                "x": 50,
                "y": 0
            })};
        square = [
                new Line2d({
                    "start": this.Dots.a,
                    "finish": this.Dots.b
                }),
                new Line2d({
                    "start": this.Dots.b,
                    "finish": this.Dots.c
                }),
                new Line2d({
                    "start": this.Dots.c,
                    "finish": this.Dots.d
                }),
                new Line2d({
                    "start": this.Dots.d,
                    "finish": this.Dots.a
                })];
        this.manager = new ManagerTrajectory({"lines":square, "radiusOfCircle": 10});
    },
    "test while(true) move from center to c then a" : function () {
        var currentState = new PlayerState({
            "location": new Point2d({
                "x": 50,
                "y": 50
            }),
            "speed": new Point2d({
                "x": 50,
                "y": 50
            })
        }),
            angleC = new Point2d({"x":90,"y":90}),
            angleA = new Point2d({"x":10,"y":10});
        currentState = this.manager.getFutureState(currentState);
        assertTrue("angleC1", angleC.equal(currentState.location));
        currentState = this.manager.getFutureState(currentState);
        assertTrue("angleA1", angleA.equal(currentState.location));
        currentState = this.manager.getFutureState(currentState);
        assertTrue("angleC2", angleC.equal(currentState.location));
        currentState = this.manager.getFutureState(currentState);
        assertTrue("angleA2", angleA.equal(currentState.location));
    },
    "test while(true) move from center to a then c invertion" : function () {
        var currentState = new PlayerState({
            "location": new Point2d({
                "x": 50,
                "y": 50
            }),
            "speed": new Point2d({
                "x": -50,
                "y": -50
            })
        }),
            angleC = new Point2d({"x":90,"y":90}),
            angleA = new Point2d({"x":10,"y":10});
        currentState = this.manager.getFutureState(currentState);
        assertTrue("A1", angleA.equal(currentState.location));
        currentState = this.manager.getFutureState(currentState);
        assertTrue("C1", angleC.equal(currentState.location));
        currentState = this.manager.getFutureState(currentState);
        assertTrue("A2", angleA.equal(currentState.location));
        currentState = this.manager.getFutureState(currentState);
        assertTrue("C2", angleC.equal(currentState.location));
    },
    "test sdfsdf" : function () {
        this.setUp();
        var currentState = new PlayerState({
            "location": new Point2d({
                "x": 25,
                "y": 25
            }),
            "speed": new Point2d({
                "x": 25,
                "y": -25
            })
        });

        currentState = this.manager.getFutureState(currentState);
        assertTrue("middleDA1", this.Dots.middleDA.equal(currentState.location)); //50 0
        currentState = this.manager.getFutureState(currentState);
        assertTrue("middleCD1", this.Dots.middleCD.equal(currentState.location)); //100 50
        currentState = this.manager.getFutureState(currentState);
        assertTrue("middleBC1", this.Dots.middleBC.equal(currentState.location)); //50 100
        currentState = this.manager.getFutureState(currentState);
        assertTrue("middleAB1", this.Dots.middleAB.equal(currentState.location)); //0 50
        currentState = this.manager.getFutureState(currentState);
        assertTrue("middleDA2", this.Dots.middleDA.equal(currentState.location)); //50 0
    }
});
