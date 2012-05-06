module.exports = (function() {
	var socketio = require("socket.io"),
 	osc = require("node-osc"),
	io = null,
 	oscServer = null,

	init = function(app) {
		oscServer = new osc.Server(3333, "0.0.0.0");
		
		io = socketio.listen(app);
		io.sockets.on("connection", onSocketConnection);
	},

	onSocketConnection = function(socket) {
		console.log("asdasd");
		oscServer.on("message", function(msg, rinfo) {
			console.log("TUIO message:", msg);
			socket.emit("tuio", msg);
		});
	};

	return {
		init: init
	};
})();