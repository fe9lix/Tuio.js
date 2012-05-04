$(document).ready(function() {
    module("Tuio.Time", {
        setup: function() {
            console.log("setup");
        },

        teardown: function() {
            console.log("teardown");
        }
    });

    test("Time: add", function() {
        var time = new Tuio.Time();
        ok(time.add);
    });
});