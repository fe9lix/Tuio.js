Tuio.Client = Tuio.Model.extend({
	host: null,
	socket: null,
	connected: null,
	objectList: null,
	aliveObjectList: null,
	newObjectList: null,
	cursorList: null,
	aliveCursorList: null,
	newCursorList: null,
	frameObjects: null,
	frameCursors: null,
	freeCursorList: null,
	maxCursorId: null,
	currentFrame: null,
	currentTime: null,

	initialize: function(params) {
		this.host = params.host;
		this.connected = false;
		this.objectList = {};
		this.aliveObjectList = [];
		this.newObjectList = [];
		this.cursorList = {};
		this.aliveCursorList = [];
		this.newCursorList = [];
		this.frameObjects = [];
		this.frameCursors = [];
		this.freeCursorList = [];
		this.maxCursorId = -1;
		this.currentFrame = 0;
		this.currentTime = null;

		_.bindAll(this, "onConnect", "acceptBundle", "onDisconnect");
	},

	connect: function() {
		Tuio.Time.initSession();
		this.currentTime = new Tuio.Time();
		this.currentTime.reset();

		this.socket = io.connect(this.host);
		this.socket.on("connect", this.onConnect);
		this.socket.on("disconnect", this.onDisconnect);
	},

	onConnect: function() {
		this.socket.on("osc", this.acceptBundle);
		this.connected = true;
	},

	onDisconnect: function() {
		this.connected = false;
	},

	isConnected: function() {
		return this.connected;
	},

	getTuioObjects: function() {
		return _.clone(this.objectList);
	},

	getTuioCursors: function() {
		return _.clone(this.cursorList);
	},

	getTuioObject: function(sid) {
		return this.objectList[sid];
	},

	getTuioCursor: function(sid) {
		return this.cursorList[sid];
	},

	acceptBundle: function(oscBundle) {
		var msg = null;

		for (var i = 0, max = oscBundle.length; i < max; i++) {
			msg = oscBundle[i];
			switch (msg[0]) {
				case "/tuio/2Dobj":
				case "/tuio/2Dcur":
					this.acceptMessage(msg);
					break;
			}
		}
	},

	acceptMessage: function(oscMessage) {
		var address = oscMessage[0],
		command = oscMessage[1],
		args = oscMessage.slice(2, oscMessage.length);

		switch (address) {
			case "/tuio/2Dobj":
				this.handleObjectMessage(command, args);
				break;
			case "/tuio/2Dcur":
				this.handleCursorMessage(command, args);
				break;
		}
	},

	handleObjectMessage: function(command, args) {
		switch (command) {
			case "set":
				this.objectSet(args);
				break;
			case "alive":
				this.objectAlive(args);
				break;
			case "fseq":
				this.objectFseq(args);
				break;
		}
	},

	handleCursorMessage: function(command, args) {
		switch (command) {
			case "set":
				this.cursorSet(args);
				break;
			case "alive":
				this.cursorAlive(args);
				break;
			case "fseq":
				this.cursorFseq(args);
				break;
		}
	},

	objectSet: function(args) {
		console.log("objectSet", args);
	},

	objectAlive: function(args) {
		console.log("objectAlive", args);
	},

	objectFseq: function(args) {
		console.log("objectFseq", args);
	},

	cursorSet: function(args) {
		console.log("cursorSet", args);
	},

	cursorAlive: function(args) {
		console.log("cursorAlive", args);
	},

	cursorFseq: function(args) {
		console.log("cursorFseq", args);
	}
});