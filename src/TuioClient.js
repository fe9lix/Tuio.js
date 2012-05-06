Tuio.Client = Tuio.Model.extend({
	port: null,
	oscPort: null,
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
	listenerList: null,

	initialize: function(params) {
		this.port = params.port || 3333;
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
		this.listenerList = [];
	},

	connect: function() {
		Tuio.Time.initSession();
		this.currentTime = new Tuio.Time();
		this.currentTime.reset();

		try {
			var socket = io.connect(null);
			socket.on("tuio", function(msg) {
				console.log(msg);
			});
			this.connected = true;
		} catch (e) {
			console.log("Tuio.Client: failed to connect to port ", port);
			this.connected = false;
		}
	}
});