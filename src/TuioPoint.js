Tuio.Point = Tuio.Model.extend({
	xPos: null,
	yPos: null,
	currentTime: null,
	startTime: null,

	initialize: function(xp, yp) {
		this.xPos = xp || 0;
		this.yPos = yp || 0;
		this.currentTime = Tuio.Time.getSessionTime();
		this.startTime = Tuio.Time.fromTime(this.currentTime);
	},

	update: function(xp, yp) {
		this.xPos = xp;
		this.yPos = yp;
	},

	updateToPoint: function(tpoint) {
		this.xPos = tpoint.getX();
		this.yPos = tpoint.getY();
	},

	updateToTimeAndPosition: function(ttime, xp, yp) {
		this.xPos = xp;
		this.yPos = yp;
		this.currentTime = Tuio.Time.fromTime(ttime);
	},

	getX: function() {
		return this.xPos;
	},

	getY: function() {
		return this.yPos;
	},

	getDistance: function(xp, yp) {
		var dx = this.xPos - xp,
		dy = this.yPos - yp;
		return Math.sqrt(dx * dx + dy * dy);
	},

	getDistanceToPoint: function(tpoint) {
		return this.getDistance(tpoint.getX(), tpoint.getY());
	},

	getAngle: function(xp, yp) {
		var side = this.xPos - xp,
		height = this.yPos - yp,
		distance = this.getDistance(xp, yp),
		angle = Math.asin(side / distance) + Math.PI / 2;

		if (height < 0) {
			angle = 2 * Math.PI - angle;
		}
		
		return angle;
	},

	getAngleToPoint: function(tpoint) {
		return this.getAngle(tpoint.getX(), tpoint.getY());
	},

	getAngleDegrees: function(xp, yp) {		
		return (this.getAngle(xp, yp) / Math.PI) * 180;
	},

	getAngleDegreesToPoint: function(tpoint) {		
		return (this.getAngleToPoint(tpoint) / Math.PI) * 180;
	},

	getScreenX: function(width) {
		return Math.round(this.xPos * width);
	},

	getScreenY: function(height) {
		return Math.round(this.yPos * height);
	},

	getTuioTime: function() {
		return Tuio.Time.fromTime(this.currentTime);
	},

	getStartTime: function() {
		return Tuio.Time.fromTime(this.startTime);
	}
}, {
	fromPoint: function(tpoint) {
		return new Tuio.Point(tpoint.getX(), tpoint.getY());
	},

	fromTimeAndPosition: function(ttime, xp, yp) {
		var point = new Tuio.Point(xp, yp);
		point.currentTime = Tuio.Time.fromTime(ttime);
		point.startTime = Tuio.Time.fromTime(point.currentTime);
		return point;
	}
});