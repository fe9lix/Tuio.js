Tuio.Time = Tuio.Model.extend({
	seconds: 0,
	microSeconds: 0,

	initialize: function(attributes) {
		if (!attributes) {
			this.seconds = 0;
			this.microSeconds = 0;
			return;
		}
		if (attributes.msec) {
			this.seconds = msec / 1000;
			this.microSeconds = 1000 * (msec % 1000);
		}
		if (attributes.sec && attributes.usec) {
			this.seconds = attributes.sec;
			this.microSeconds = attributes.usec;
		}
		if (attributes.ttime) {
			this.seconds = ttime.getSeconds();
			this.microSeconds = ttime.getMicroseconds();
		}
	},

	add: function(us) {
		return new Tuio.Time({
			sec: this.seconds + us / 1000000,
			usec: this.microSeconds + us % 1000000
		});
	},

	addTime: function(ttime) {
		var sec = this.seconds + ttime.getSeconds(),
		usec = this.microSeconds + ttime.getMicroseconds();
		sec += usec / 1000000;
		usec = usec % 1000000;
		
		return new Tuio.Time({
			sec: sec,
			usec: usec
		});
	},

	substract: function(us) {
		var sec = this.seconds - us / 1000000,
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
		var sec = this.seconds - ttime.getSeconds();
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
		return this.seconds * 1000 + this.microSeconds / 1000;
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
		return Tuio.Time.getSystemTime().subtract(Tuio.Time.getStartTime());
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
			sec: usec / 1000000,
			usec: usec % 1000000
		});
	}
});