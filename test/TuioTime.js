$(document).ready(function() {
    module("Tuio.Time", {
        setup: function() {
            Tuio.Time.initSession();
        },

        teardown: function() {
            Tuio.Time.startSeconds = 0;
            Tuio.Time.startMicroSeconds = 0;
        }
    });

    test("Time: constructor with sec and usec", function() {
        var time = new Tuio.Time({
            sec: 100,
            usec: 100000
        });

        equal(time.getSeconds(), 100);
        equal(time.getMicroseconds(), 100000);
    });


    test("Time: add few microseconds", function() {
        var time = new Tuio.Time(),
        newTime = time.add(5000);

        equal(newTime.getSeconds(), 0);
        equal(newTime.getMicroseconds(), 5000);
    });

    test("Time: add lots of microseconds", function() {
        var time = new Tuio.Time(),
        newTime = time.add(10000000);

        equal(newTime.getSeconds(), 10);
        equal(newTime.getMicroseconds(), 0);
    });

    test("Time: subtract time", function() {
        var time = new Tuio.Time({
            sec: 100,
            usec: 5000
        }),
        newTime = time.subtractTime(new Tuio.Time({
            sec: 20,
            usec: 1000
        }));
        
        equal(newTime.getSeconds(), 80);
        equal(newTime.getMicroseconds(), 4000);
    });

    test("Time: equals", function() {
        var time1 = new Tuio.Time({
            msec: 2000
        }),
        time2 = new Tuio.Time({
            msec: 2000
        });
        
        ok(time1.equals(time2));
        equal(time1.getTotalMilliseconds(), time2.getTotalMilliseconds());
    });

    test("Time: reset", function() {
        var time = new Tuio.Time({
            msec: 10000
        });
        time.reset();
        
        equal(time.getSeconds(), 0);
        equal(time.getMicroseconds(), 0);
        equal(time.getTotalMilliseconds(), 0);
    });

    test("Time: getSessionTime", function() {
        var systemTime = Tuio.Time.getSystemTime(),
        startTime = Tuio.Time.getStartTime(),
        sessionTime = Tuio.Time.getSessionTime(),
        expectedSessionTime = systemTime.subtractTime(startTime);
        
        ok(sessionTime.equals(expectedSessionTime));
    });
});