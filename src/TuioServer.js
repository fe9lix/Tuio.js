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
            console.log("TUIO message:", msg);
            socket.emit("tuio", msg);
        });
    };

    return {
        init: init
    };
}());