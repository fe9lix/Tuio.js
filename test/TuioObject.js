$(document).ready(function() {
    module("Tuio.Object", {
        setup: function() {

        },

        teardown: function() {

        }
    });

    test("construct", function() {
        var object = new Tuio.Object({
            sym: 2,
            a: Math.PI
        });

        equal(object.getX(), 0);
        equal(object.getY(), 0);
        equal(object.getSymbolId(), 2);
        equal(object.getAngle(), Math.PI);
        equal(object.getAngleDegrees(), 180);
        equal(object.getRotationSpeed(), 0);
        equal(object.getRotationAccel(), 0);
        ok(!object.isMoving());
    });

    test("update", function() {
        var object = new Tuio.Object({
            ttime: new Tuio.Time(20, 0),
            xp: 0,
            yp: 10,
            sym: 2,
            a: 0
        });

        object.update({
            ttime: new Tuio.Time(25, 0),
            xp: 0,
            yp: 25,
            a: Math.PI
        });

        equal(object.getX(), 0);
        equal(object.getY(), 25);
        equal(object.getAngleDegrees(), 180);
        equal(object.getRotationSpeed(), 0.1);
        equal(object.getRotationAccel(), 0.02);
        equal(object.getTuioState(), Tuio.Object.TUIO_ROTATING);
        ok(object.isMoving());

        object.update({
            ttime: new Tuio.Time(30, 0),
            a: Math.PI / 2,
            rs: 0.05,
            ra: 0.001
        });

        equal(object.getAngleDegrees(), 90);
        equal(object.getRotationSpeed(), 0.05);
        equal(object.getRotationAccel(), 0.001);
    });

    test("stop", function() {
        var object = new Tuio.Object({
            ttime: new Tuio.Time(20, 0),
            xp: 10,
            yp: 10,
            sym: 5,
            a: Math.PI / 4
        });

        object.update({
            ttime: new Tuio.Time(30),
            xp: 20,
            yp: 20,
            a: Math.PI / 2
        });

        ok(object.isMoving());

        object.stop(new Tuio.Time(50, 0));

        equal(object.getX(), 20);
        equal(object.getY(), 20);
        equal(object.getAngle(), Math.PI / 2);
        equal(object.getRotationSpeed(), 0);
        ok(object.getTuioTime().equals(new Tuio.Time(50, 0)));
    });
});