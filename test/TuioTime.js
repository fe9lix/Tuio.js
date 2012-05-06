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

    test("initialize with sec and usec", function() {
        var time = new Tuio.Time(100, 100000);

        equal(time.getSeconds(), 100);
        equal(time.getMicroseconds(), 100000);
    });


    test("add few microseconds", function() {
        var time = new Tuio.Time(),
        newTime = time.add(5000);

        equal(newTime.getSeconds(), 0);
        equal(newTime.getMicroseconds(), 5000);
    });

    test("add lots of microseconds", function() {
        var time = new Tuio.Time(),
        newTime = time.add(10000000);

        equal(newTime.getSeconds(), 10);
        equal(newTime.getMicroseconds(), 0);
    });

    test("subtract time", function() {
        var time = new Tuio.Time(100, 5000),
        newTime = time.subtractTime(new Tuio.Time(20, 1000));
        
        equal(newTime.getSeconds(), 80);
        equal(newTime.getMicroseconds(), 4000);
    });

    test("equals", function() {
        var time1 = new Tuio.Time.fromMilliseconds(2000),
        time2 = new Tuio.Time.fromMilliseconds(2000);
        
        ok(time1.equals(time2));
        equal(time1.getTotalMilliseconds(), time2.getTotalMilliseconds());
    });

    test("reset", function() {
        var time = new Tuio.Time.fromMilliseconds(10000);
        time.reset();
        
        equal(time.getSeconds(), 0);
        equal(time.getMicroseconds(), 0);
        equal(time.getTotalMilliseconds(), 0);
    });

    test("getSessionTime", function() {
        var systemTime = Tuio.Time.getSystemTime(),
        startTime = Tuio.Time.getStartTime(),
        sessionTime = Tuio.Time.getSessionTime(),
        expectedSessionTime = systemTime.subtractTime(startTime);
        
        ok(sessionTime.equals(expectedSessionTime));
    });
});