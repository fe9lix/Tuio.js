var express = require("express"),
tuioServer = require("./TuioServer.js"),
app = null;

app = express.createServer();
app.use(express.static(__dirname + "/../"));
app.listen(5000);

tuioServer.init(app);