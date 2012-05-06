$(document).ready(function() {
    module("Tuio.Point", {
        setup: function() {

        },

        teardown: function() {

        }
    });

    test("initialize with position", function() {
        var point = new Tuio.Point({xp: 10, yp: 20});

        equal(point.getX(), 10);
        equal(point.getY(), 20);
    });

    test("initialize with time and position", function() {
        var point = new Tuio.Point({
            ttime: new Tuio.Time(2, 5000),
            xp: 10,
            yp: 20
        });

        equal(point.getX(), 10);
        equal(point.getY(), 20);
        ok(point.currentTime.equals(point.getTuioTime()));
        ok(point.startTime.equals(point.getStartTime()));
    });

    test("updateToPoint", function() {
        var point1 = new Tuio.Point({xp: 2, yp: 18}),
        point2 = new Tuio.Point({xp: 4, yp: 4});
        point1.updateToPoint(point2);

        equal(point1.getX(), 4);
        equal(point1.getY(), 4);
    });
   
    test("getDistance", function() {
        var point = new Tuio.Point({xp: 0, yp: 0});

        equal(point.getDistance(0, 10), 10);
    });

    test("getDistanceToPoint", function() {
        var point1 = new Tuio.Point({xp: 2, yp: 2}),
        point2 = new Tuio.Point({xp: 6, yp: 2});

        equal(point1.getDistanceToPoint(point2), 4);
    });

    test("getAngleDegrees", function() {
        var point = new Tuio.Point({xp: 10, yp: 10});

        equal(point.getAngleDegrees(20, 20), 315);
    });

    test("getAngleDegreesToPoint", function() {
        var point1 = new Tuio.Point({xp: 100, yp: 100}),
        point2 = new Tuio.Point({xp: 50, yp: 50});

        equal(point1.getAngleDegreesToPoint(point2), 135);
    });

    test("getScreenX/Y", function() {
        var point = new Tuio.Point({xp: 0.5, yp: 0.1});

        equal(point.getScreenX(800), 400);
        equal(point.getScreenY(600), 60);
    });
});