$(document).ready(function() {
    module("Tuio.Container", {
        setup: function() {

        },

        teardown: function() {

        }
    });

    test("Container: constructor with session id, x and y position", function() {
        var container = Tuio.Container.fromPosition(1, 10, 20);

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

    test("Container: update", function() {
        var container = Tuio.Container.fromTime(new Tuio.Time(0, 0), 1, 0, 0);

        container.update(new Tuio.Time(2, 0), 50, 0);

        equal(container.getX(), 50);
        equal(container.getY(), 0);
        equal(container.getXSpeed(), 25);
        equal(container.getYSpeed(), 0);
        equal(container.getMotionSpeed(), 25);
        equal(container.getMotionAccel(), 12.5);
        equal(container.getPath().length, 2);
        equal(container.getTuioState(), Tuio.Container.TUIO_ACCELERATING);

        container.update(new Tuio.Time(3, 0), 60, 0);

        equal(container.getTuioState(), Tuio.Container.TUIO_DECELERATING);
    });

    test("Container: updateWithVelocityAndAcceleration", function() {
        var container = Tuio.Container.fromTime(new Tuio.Time(0, 0), 1, 0, 0);

        container.updateWithVelocityAndAcceleration(
            new Tuio.Time(2, 0),
            50, 
            0,
            25, 
            0,
            12.5
        );

        equal(container.getX(), 50);
        equal(container.getY(), 0);
        equal(container.getXSpeed(), 25);
        equal(container.getYSpeed(), 0);
        equal(container.getMotionAccel(), 12.5);
        equal(container.getPath().length, 2);
        equal(container.getTuioState(), Tuio.Container.TUIO_ACCELERATING);
    });

    test("Container: stop", function() {
        var container = Tuio.Container.fromTime(new Tuio.Time(0, 0), 1, 0, 0);

        container.update(new Tuio.Time(2, 0), 50, 0);

        container.stop(new Tuio.Time(3, 0));

        equal(container.getX(), 50);
        equal(container.getY(), 0);
        equal(container.getMotionSpeed(), 0);
        equal(container.getTuioState(), Tuio.Container.TUIO_DECELERATING);
    });

    test("Container: remove", function() {
        var container = Tuio.Container.fromPosition(1, 10, 20);

        container.remove(new Tuio.Time(2, 0));

        equal(container.getTuioState(), Tuio.Container.TUIO_REMOVED);
        ok(container.getTuioTime().equals(new Tuio.Time(2, 0)));
    });

    test("Container: isMoving", function() {
        var container = Tuio.Container.fromTime(new Tuio.Time(0, 0), 1, 0, 0);

        container.update(new Tuio.Time(2, 0), 50, 0);

        ok(container.isMoving());

        container.update(new Tuio.Time(3, 0), 60, 0);

        ok(container.isMoving());
    });
});