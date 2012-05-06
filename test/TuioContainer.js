$(document).ready(function() {
    module("Tuio.Container", {
        setup: function() {

        },

        teardown: function() {

        }
    });

    test("initialize with session id and position", function() {
        var container = new Tuio.Container({
            si: 1,
            xp: 10,
            yp: 20
        });

        equal(container.getSessionId(), 1);
        equal(container.getX(), 10);
        equal(container.getY(), 20);
        equal(container.getXSpeed(), 0);
        equal(container.getYSpeed(), 0);
        equal(container.getMotionSpeed(), 0);
        equal(container.getMotionAccel(), 0);
        equal(container.getPath().length, 1);
        equal(container.getTuioState(), Tuio.Container.TUIO_ADDED);
    });

    test("update", function() {
        var container = new Tuio.Container({
            ttime: new Tuio.Time(0, 0),
            si: 1,
            xp: 0,
            yp: 0
        });

        container.update({
            ttime: new Tuio.Time(2, 0),
            xp: 50,
            yp: 0
        });

        equal(container.getX(), 50);
        equal(container.getY(), 0);
        equal(container.getXSpeed(), 25);
        equal(container.getYSpeed(), 0);
        equal(container.getMotionSpeed(), 25);
        equal(container.getMotionAccel(), 12.5);
        equal(container.getPath().length, 2);
        equal(container.getTuioState(), Tuio.Container.TUIO_ACCELERATING);

        container.update({
            ttime: new Tuio.Time(3, 0),
            xp: 60,
            yp: 0
        });

        equal(container.getTuioState(), Tuio.Container.TUIO_DECELERATING);
    });

    test("update with velocity and acceleration", function() {
        var container = new Tuio.Container({
            ttime: new Tuio.Time(0, 0),
            si: 1,
            xp: 0,
            yp: 0
        });

        container.update({
            ttime: new Tuio.Time(2, 0),
            xp: 50,
            yp: 0,
            xs: 25,
            ys: 0,
            ma: 12.5
        });

        equal(container.getX(), 50);
        equal(container.getY(), 0);
        equal(container.getXSpeed(), 25);
        equal(container.getYSpeed(), 0);
        equal(container.getMotionAccel(), 12.5);
        equal(container.getPath().length, 2);
        equal(container.getTuioState(), Tuio.Container.TUIO_ACCELERATING);
    });

    test("stop", function() {
        var container = new Tuio.Container({
            ttime: new Tuio.Time(0, 0),
            si: 1,
            xp: 0,
            yp: 0
        });

        container.update({
            ttime: new Tuio.Time(2, 0),
            xp: 50,
            yp: 0
        });

        container.stop(new Tuio.Time(3, 0));

        equal(container.getX(), 50);
        equal(container.getY(), 0);
        equal(container.getMotionSpeed(), 0);
        equal(container.getTuioState(), Tuio.Container.TUIO_DECELERATING);
    });

    test("remove", function() {
        var container = new Tuio.Container({
            si: 1,
            xp: 10,
            yp: 20
        });

        container.remove(new Tuio.Time(2, 0));

        equal(container.getTuioState(), Tuio.Container.TUIO_REMOVED);
        ok(container.getTuioTime().equals(new Tuio.Time(2, 0)));
    });

    test("isMoving", function() {
        var container = new Tuio.Container({
            ttime: new Tuio.Time(0, 0),
            si: 1,
            xp: 0,
            yp: 0
        });

        container.update({
            ttime: new Tuio.Time(2, 0),
            xp: 50,
            yp: 0
        });

        ok(container.isMoving());

        container.update({
            ttime: new Tuio.Time(3, 0),
            xp: 60,
            yp: 0
        });

        ok(container.isMoving());
    });
});