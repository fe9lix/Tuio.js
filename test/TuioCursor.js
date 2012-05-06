$(document).ready(function() {
    module("Tuio.Cursor", {
        setup: function() {

        },

        teardown: function() {

        }
    });

    test("construct", function() {
        var cursor = new Tuio.Cursor({
            ttime: new Tuio.Time(),
            si: 1,
            ci: 5,
            xp: 10,
            yp: 20
        });

        equal(cursor.getSessionId(), 1);
        equal(cursor.getCursorId(), 5);
        equal(cursor.getX(), 10);
        equal(cursor.getY(), 20);
        equal(cursor.getXSpeed(), 0);
        equal(cursor.getYSpeed(), 0);
        equal(cursor.getMotionSpeed(), 0);
        equal(cursor.getMotionAccel(), 0);
        equal(cursor.getPath().length, 1);
        equal(cursor.getTuioState(), Tuio.Container.TUIO_ADDED);
    });

    test("fromCursor", function() {
       var cursor1 = new Tuio.Cursor({
            ttime: new Tuio.Time(),
            si: 1,
            ci: 5,
            xp: 10,
            yp: 20
        }),

        cursor2 = Tuio.Cursor.fromCursor(cursor1);

        equal(cursor2.getSessionId(), 1);
        equal(cursor2.getCursorId(), 5);
        equal(cursor2.getX(), 10);
        equal(cursor2.getY(), 20);
        equal(cursor2.getXSpeed(), 0);
        equal(cursor2.getYSpeed(), 0);
        equal(cursor2.getMotionSpeed(), 0);
        equal(cursor2.getMotionAccel(), 0);
        equal(cursor2.getPath().length, 1);
        equal(cursor2.getTuioState(), Tuio.Container.TUIO_ADDED);
    });
});