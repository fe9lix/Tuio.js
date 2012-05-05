Tuio.Container = Tuio.Point.extend({
	sessionId: null,
	xSpeed: null,
	ySpeed: null,
	motionSpeed: null,
	motionAccel: null,
	path: null,
	state: null,

	initialize: function() {

	},

	initializeFromPosition: function(si, xp, yp) {
		Tuio.Point.prototype.initializeFromPosition.call(this, xp, yp);
		this.initializeContainer(si);
	},

	initializeFromTime: function(ttime, si, xp, yp) {
		Tuio.Point.prototype.initializeFromTime.call(this, ttime, xp, yp);
		this.initializeContainer(si);
	},

	initializeFromContainer: function(tcon) {
		Tuio.Point.prototype.initializeFromPoint.call(this, tcon);
		this.initializeContainer(tcon.getSessionId());
	},

	initializeContainer: function(si) {
		this.sessionId = si;
		this.xSpeed = 0;
		this.ySpeed = 0;
		this.motionSpeed = 0;
		this.motionAccel = 0;
		this.path = [Tuio.Point.fromTime(this.currentTime, this.xPos, this.yPos)];
		this.state = Tuio.Container.TUIO_ADDED;
	},

	update: function(ttime, xp, yp) {
		var lastPoint = this.path[this.path.length - 1];
		Tuio.Point.prototype.updateToTime.call(this, ttime, xp, yp);
		
		var diffTime = this.currentTime.subtractTime(lastPoint.getTuioTime()),
		dt = diffTime.getTotalMilliseconds() / 1000,
		dx = this.xPos - lastPoint.getX(),
		dy = this.yPos - lastPoint.getY(),
		dist = Math.sqrt(dx * dx + dy * dy),
		lastMotionSpeed = this.motionSpeed;
		
		this.xSpeed = dx / dt;
		this.ySpeed = dy / dt;
		this.motionSpeed = dist / dt;
		this.motionAccel = (this.motionSpeed - lastMotionSpeed) / dt;
		
		this.updatePathAndState(); 
	},

	updateWithVelocityAndAcceleration: function(ttime, xp, yp, xs, ys, ma) {
		Tuio.Point.prototype.updateToTime.call(this, ttime, xp, yp);

		this.updateVelocityAndAcceleration(xs, ys, ma);
	},

	updatePositionVelocityAndAcceleration: function(xp, yp, xs, ys, ma) {
		Tuio.Point.prototype.update.call(this, xp, yp);

		this.updateVelocityAndAcceleration(xs, ys, ma);
	},

	updateVelocityAndAcceleration: function(xs, ys, ma) {
		this.xSpeed = xs;
		this.ySpeed = ys;
		this.motionSpeed = Math.sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed);
		this.motionAccel = ma;

		this.updatePathAndState();
	},

	updateContainer: function(tcon) {
		Tuio.Point.prototype.updateToPoint.call(this, tcon);

		this.xSpeed = tcon.getXSpeed();
		this.ySpeed = tcon.getYSpeed();
		this.motionSpeed = tcon.getMotionSpeed();
		this.motionAccel = tcon.getMotionAccel();

		this.updatePathAndState();
	},

	updatePathAndState: function() {
		this.path.push(Tuio.Point.fromTime(this.currentTime, this.xPos, this.yPos));

		if (this.motionAccel > 0) {
			this.state = Tuio.Container.TUIO_ACCELERATING;
		} else if (this.motionAccel < 0) {
			this.state = Tuio.Container.TUIO_DECELERATING;
		} else {
			this.state = Tuio.Container.TUIO_STOPPED;
		}
	},

	stop: function(ttime) {
		this.update(ttime, this.xPos, this.yPos);
	},

	remove: function(ttime) {
		this.currentTime = Tuio.Time.fromTime(ttime);
		this.state = Tuio.Container.TUIO_REMOVED;
	},

	getSessionId: function() {
		return this.sessionId;
	},

	getXSpeed: function() {
		return this.xSpeed;
	},

	getYSpeed: function() {
		return this.ySpeed;
	},

	getPosition: function() {
		return new Tuio.Point(this.xPos, this.yPos);
	},

	getPath: function() {
		return this.path;
	},

	getMotionSpeed: function() {
		return this.motionSpeed;
	},

	getMotionAccel: function() {
		return this.motionAccel;
	},

	getTuioState: function() {
		return this.state;
	},

	isMoving: function() {
		return (
			(this.state === Tuio.Container.TUIO_ACCELERATING) || 
			(this.state === Tuio.Container.TUIO_DECELERATING)
		);
	}
}, {
	TUIO_ADDED: 0,
	TUIO_ACCELERATING: 1,
	TUIO_DECELERATING: 2,
	TUIO_STOPPED: 3,
	TUIO_REMOVED: 4,

	fromPosition: function(si, xp, yp) {
		var container = new Tuio.Container();
		container.initializeFromPosition(si, xp, yp);
		return container;
	},

	fromTime: function(ttime, si, xp, yp) {
		var container = new Tuio.Container();
		container.initializeFromTime(ttime, si, xp, yp);
		return container;
	},

	fromContainer: function(tcon) {
		var container = new Tuio.Container();
		container.initializeFromContainer(tcon);
		return container;
	}
});