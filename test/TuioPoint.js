$(document).ready(function() {
    module("Tuio.Point", {
        setup: function() {

        },

        teardown: function() {

        }
    });

    test("Point: constructor with x and y position", function() {
        var point = new Tuio.Point(10, 20);

        equal(point.getX(), 10);
        equal(point.getY(), 20);
    });

    test("Point: construct from time and position", function() {
        var point = Tuio.Point.fromTimeAndPosition(
            new Tuio.Time(2, 5000),
            10, 
            20
        );

        equal(point.getX(), 10);
        equal(point.getY(), 20);
        ok(point.currentTime.equals(point.getTuioTime()));
        ok(point.startTime.equals(point.getStartTime()));
    });

    test("Point: updateToPoint", function() {
        var point1 = new Tuio.Point(2, 18),
        point2 = new Tuio.Point(4, 4);
        point1.updateToPoint(point2);

        equal(point1.getX(), 4);
        equal(point1.getY(), 4);
    });
   
    test("Point: getDistance", function() {
        var point = new Tuio.Point(0, 0);

        equal(point.getDistance(0, 10), 10);
    });

    test("Point: getDistanceToPoint", function() {
        var point1 = new Tuio.Point(2, 2),
        point2 = new Tuio.Point(6, 2);

        equal(point1.getDistanceToPoint(point2), 4);
    });

    test("Point: getAngleDegrees", function() {
        var point = new Tuio.Point(10, 10);

        equal(point.getAngleDegrees(20, 20), 315);
    });

    test("Point: getAngleDegreesToPoint", function() {
        var point1 = new Tuio.Point(100, 100),
        point2 = new Tuio.Point(50, 50);

        equal(point1.getAngleDegreesToPoint(point2), 135);
    });

    test("Point: getScreenX/Y", function() {
        var point = new Tuio.Point(0.5, 0.1);

        equal(point.getScreenX(800), 400);
        equal(point.getScreenY(600), 60);
    });
});