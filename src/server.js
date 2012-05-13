var express = require("express"),
tuioServer = require("./TuioServer.js"),

app = express.createServer();
app.use(express["static"](__dirname + "/../"));
app.listen(5000);

tuioServer.init({
	oscPort: 3333,
	oscHost: "0.0.0.0",
	socketPort: app
});