GreeterTest = TestCase("Line's Test", {
    "test point on line" : function () {
        var pointOnLine = new Point2d({
            "x": 0,
            "y": 0
        });
        var pointOnOtherLine = new Point2d({
            "x": 69,
            "y": 13
        });
        var startLine = new Point2d({
            "x": -10,
            "y": -10
        });
        var finishLine = new Point2d({
            "x": 10,
            "y": 10
        });
        var line = new Line2d({
            "start": startLine,
            "finish": finishLine
        });
        assertEquals("Point on line", true, line.onLine(pointOnLine));
        assertTrue("Point on other line", !(line.onLine(pointOnOtherLine)));
    },
    "test on cross line": function () {
        var a = new Point2d({
                "x": 0,
                "y": 0
            }),
            b = new Point2d({
                "x": 10,
                "y": 0
            }),
            c = new Point2d({
                "x": 10,
                "y": 10
            }),
            d = new Point2d({
                "x": 0,
                "y": 10
            }),
            center = new Point2d({
                "x": 5,
                "y": 5
            }),
            ab = new Line2d({
                "start": a,
                "finish": b}),
            cd = new Line2d({"start": c, "finish": d}),
            ba = new Line2d({"start": b, "finish": a}),
            ac = new Line2d({"start": a,"finish": c}),
            bd = new Line2d({"start": b,"finish": d}),
            cross = ac.getCross(bd);
        assertNull("don't cross", ab.getCross(cd));
        assertNull("don't cross", cd.getCross(ab));
        assertNull("many cross", ab.getCross(ab));
        assertNull("many cross", ab.getCross(ba));
        assertNotNull("Cross exists", cross);
        assertTrue("Cross is center of square", cross.equal(center));
        cross = ab.getCross(ac);
        assertTrue("Cross is the A point", cross.equal(a));
    },
    "test on create mirror line": function()
        {
            var zero = new Point2d({
                    "x":0,
                    "y":0
                }),
                mirrorPoint = new Point2d({
                    "x":-50,
                    "y": 50
                }),
                pointX = new Point2d({
                    "x": 100,
                    "y": 0
                }),
                pointLine = new Point2d({
                    "x": 50,
                    "y": 50
                }),
                ox = new Line2d({
                    "start":zero,
                    "finish":pointX
                }),
                otherLine = new Line2d({
                    "start": pointLine,
                    "finish": zero
                }),
                mirrorLine;
            mirrorLine= otherLine.getMirrorReflection(ox);
            assertTrue("Cross is the A point", mirrorLine);
        }

    });
