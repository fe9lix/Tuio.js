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
});