$(document).ready(function() {
    module("Tuio.Client", {
        setup: function() {

        },

        teardown: function() {

        }
    });

    test("construct", function() {
        var client = new Tuio.Client({
            host: "http://localhost:5000"
        });

        equal(client.host, "http://localhost:5000");
    });
});