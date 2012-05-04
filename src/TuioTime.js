Tuio.Time = Tuio.Model.extend({
	seconds: 0,
	microSeconds: 0,

	initialize: function(attributes) {
		if (!attributes) {
			this.seconds = 0;
			this.microSeconds = 0;
			return;
		}
		if (attributes.hasOwnProperty("msec")) {
			this.seconds = Math.floor(attributes.msec / 1000);
			this.microSeconds = 1000 * (attributes.msec % 1000);
		}
		if (attributes.hasOwnProperty("sec") && attributes.hasOwnProperty("usec")) {
			this.seconds = attributes.sec;
			this.microSeconds = attributes.usec;
		}
		if (attributes.hasOwnProperty("ttime")) {
			this.seconds = ttime.getSeconds();
			this.microSeconds = ttime.getMicroseconds();
		}
	},

	add: function(us) {
		return new Tuio.Time({
			sec: this.seconds + Math.floor(us / 1000000),
			usec: this.microSeconds + us % 1000000
		});
	},

	addTime: function(ttime) {
		var sec = this.seconds + ttime.getSeconds(),
		usec = this.microSeconds + ttime.getMicroseconds();
		sec += Math.floor(usec / 1000000);
		usec = usec % 1000000;
		
		return new Tuio.Time({
			sec: sec,
			usec: usec
		});
	},

	subtract: function(us) {
		var sec = this.seconds - Math.floor(us / 1000000),
		usec = this.microSeconds - us % 1000000;
		
		if (usec < 0) {
			usec += 1000000;
			sec--;
		}	
		
		return new Tuio.Time({
			sec: sec,
			usec: usec
		});
	},

	subtractTime: function(ttime) {
		var sec = this.seconds - ttime.getSeconds(),
		usec = this.microSeconds - ttime.getMicroseconds();

		if (usec < 0) {
			usec += 1000000;
			sec--;
		}
		
		return new Tuio.Time({
			sec: sec,
			usec: usec
		});
	},

	equals: function(ttime) {
		return ((this.seconds === ttime.getSeconds()) && (this.microSeconds === ttime.getMicroseconds()));
	},

	reset: function() {
		this.seconds = 0;
		this.microSeconds = 0;
	},

	getSeconds: function() {
		return this.seconds;
	},

	getMicroseconds: function() {
		return this.microSeconds;
	},

	getTotalMilliseconds: function() {
		return this.seconds * 1000 + Math.floor(this.microSeconds / 1000);
	}	
}, {
	startSeconds: 0,
	startMicroSeconds: 0,

	initSession: function() {
		var startTime = Tuio.Time.getSystemTime();
		Tuio.Time.startSeconds = startTime.getSeconds();
		Tuio.Time.startMicroSeconds = startTime.getMicroseconds();
	},

	getSessionTime: function() {
		return Tuio.Time.getSystemTime().subtractTime(Tuio.Time.getStartTime());
	},

	getStartTime: function() {
		return new Tuio.Time({
			sec: Tuio.Time.startSeconds,
			usec: Tuio.Time.startMicroSeconds
		});
	},

	getSystemTime: function() {
		var usec = new Date().getTime() * 1000;

		return new Tuio.Time({
			sec: Math.floor(usec / 1000000),
			usec: usec % 1000000
		});
	}
});