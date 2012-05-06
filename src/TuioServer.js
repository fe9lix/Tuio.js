module.exports = (function() {
    var socketio = require("socket.io"),
    osc = require("node-osc"),
    io = null,
    oscServer = null,

    init = function(params) {
        oscServer = new osc.Server(params.oscPort, params.oscHost);

        io = socketio.listen(params.socketPort);
        io.sockets.on("connection", onSocketConnection);
    },

    onSocketConnection = function(socket) {
        oscServer.on("message", function(msg, rinfo) {
            socket.emit("osc", msg);
        });
    };

    return {
        init: init
    };
}());