$(document).ready(function() {
    module("Tuio.Client", {
        setup: function() {

        },

        teardown: function() {

        }
    });

    test("construct", function() {
        var client = new Tuio.Client({});

        equal(client.port, 3333);
    });
});