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
		var sid = args[0],
		xPos = args[1],
		yPos = args[2],
		xSpeed = args[3],
		ySpeed = args[4],
		mAccel = args[5];

		if (_.has(this.cursorList, sid)) {
			var tcur = this.cursorList[sid];
			if (!tcur) {
				return;
			}
			if (
				(tcur.xPos !== xPos) ||
				(tcur.yPos !== yPos) ||
				(tcur.xSpeed !== xSpeed) ||
				(tcur.ySpeed !== ySpeed ) ||
				(tcur.motionAccel !== mAccel)) {

				var updateCursor = new Tuio.Cursor({
					si: sid,
					ci: tcur.getCursorId(),
					xp: xPos,
					yp: yPos
				});
				updateCursor.update({
					xp: xPos,
					yp: yPos,
					xs: xSpeed,
					ys: ySpeed,
					ma: mAccel
				});
				this.frameCursors.push(updateCursor);
			}
		} else {
			var addCursor = new Tuio.Cursor({
				si: sid,
				ci: -1,
				xp: xPos,
				yp: yPos
			});
			this.frameCursors.push(addCursor);
		}
	},

	cursorAlive: function(args) {
		var removeCursor = null;
		this.newCursorList = args;
		this.aliveCursorList = _.difference(this.aliveCursorList, args);

		for (var i = 0, max = this.aliveCursorList.length; i < max; i++) {
			removeCursor = this.cursorList[this.aliveCursorList[i]];
			if (removeCursor) {
				removeCursor.remove(this.currentTime);
				this.frameCursors.push(removeCursor);
			}
		}
	},

	cursorFseq: function(args) {
		var fseq = args[0],
		lateFrame = false,
		tcur = null,
		removeCursor = null;

		if (fseq > 0) {
			if (fseq > this.curentFrame) {
				this.currentTime = Tuio.Time.getSessionTime();
			}
			if ((fseq >= this.currentFrame) || ((this.currentFrame - fseq) > 100)) {
				this.currentFrame = fseq;
			} else {
				lateFrame = true;
			}
		} else if (Tuio.Time.getSessionTime().subtractTime(this.currentTime).getTotalMilliseconds() > 100) {
			this.currentTime = Tuio.Time.getSessionTime();
		}

		if (!lateFrame) {
			for (var i = 0, max = this.frameCursors.length; i < max; i++) {
				tcur = this.frameCursors[i];
				switch (tcur.getTuioState()) {
					case Tuio.Cursor.TUIO_REMOVED:
						this.tuioRemoved(tcur);
						break;
					case Tuio.Cursor.TUIO_ADDED:
						this.tuioAdded(tcur);
						break;
					default:
						this.tuioDefault(tcur);
						break;
				}
			}

			this.trigger("refresh", Tuio.Time.fromTime(this.currentTime));

			var buffer = this.aliveCursorList;
			this.aliveCursorList = this.newCursorList;
			this.newCursorList = buffer;
		}

		this.frameCursors = [];
	},

	tuioRemoved: function(tcur) {
		var removeCursor = tcur;
		removeCursor.remove(this.currentTime);

		this.trigger("removeTuioCursor", removeCursor);

		delete this.cursorList[removeCursor.getSessionId()];

		if (removeCursor.getCursorId() === this.maxCursorId) {
			this.maxCursorId = -1;
			if (_.size(this.cursorList) > 0) {
				var maxCursor = _.max(this.cursorList, function(cur) {
					return cur.getCursorId();
				});
				if (maxCursor.getCursorId() > this.maxCursorId) {
					this.maxCursorId = maxCursor.getCursorId();
				}

				this.freeCursorList = _.without(this.freeCursorList, function(cur) {
					return cur.getCursorId() >= this.maxCursorId;
				});
			} else {
				this.freeCursorList = [];
			}
		} else if (removeCursor.getCursorId() < this.maxCursorId) {
			this.freeCursorList.push(removeCursor);
		}
	},

	tuioAdded: function(tcur) {
		var cid = _.size(this.cursorList),
		testCursor = null;

		if ((cid <= this.maxCursorId) && (this.freeCursorList.length > 0)) {
			var closestCursor = this.freeCursorList[0];
			for (var i = 0, max = this.freeCursorList.length; i < max; i++) {
				testCursor = this.freeCursorList[i];
				if (testCursor.getDistanceToPoint(tcur) < closestCursor.getDistanceToPoint(tcur)) {
					closestCursor = testCursor;
				}
			}
			cid = closestCursor.getCursorId();
			this.freeCursorList = _.without(this.freeCursorList, function(cur) {
				return cur.getCursorId() === cid;
			});
		} else {
			this.maxCursorId = cid;
		}

		var addCursor = new Tuio.Cursor({
			ttime: this.currentTime,
			si: tcur.getSessionId(),
			ci: cid,
			xp: tcur.getX(),
			yp: tcur.getY()
		});
		this.cursorList[addCursor.getSessionId()] = addCursor;

		this.trigger("addTuioCursor", addCursor);
	},

	tuioDefault: function(tcur) {
		var updateCursor = this.cursorList[tcur.getSessionId()];
		if (
			(tcur.getX() !== updateCursor.getX() && tcur.getXSpeed() === 0) ||
			(tcur.getY() !== updateCursor.getY() && tcur.getYSpeed() === 0)) {

			updateCursor.update({
				ttime: this.currentTime,
				xp: tcur.getX(),
				yp: tcur.getY()
			});
		} else {
			updateCursor.update({
				ttime: this.currentTime,
				xp: tcur.getX(),
				yp: tcur.getY(),
				xs: tcur.getXSpeed(),
				ys: tcur.getYSpeed(),
				ma: tcur.getMotionAccel()
			});
		}
		
		this.trigger("updateTuioCursor", updateCursor);
	}
});