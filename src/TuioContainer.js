Tuio.Container = Tuio.Point.extend({
    sessionId: null,
    xSpeed: null,
    ySpeed: null,
    motionSpeed: null,
    motionAccel: null,
    path: null,
    state: null,

    initialize: function(params) {
        Tuio.Point.prototype.initialize.call(this, params);

        this.sessionId = params.si;
        this.xSpeed = 0;
        this.ySpeed = 0;
        this.motionSpeed = 0;
        this.motionAccel = 0;
        this.path = [new Tuio.Point({
            ttime: this.currentTime,
            xp: this.xPos,
            yp: this.yPos
        })];
        this.state = Tuio.Container.TUIO_ADDED;
    },

    update: function(params) {
        var lastPoint = this.path[this.path.length - 1];
        Tuio.Point.prototype.update.call(this, params);
        
        if (
            params.hasOwnProperty("xs") &&
            params.hasOwnProperty("ys") &&
            params.hasOwnProperty("ma")) {

            this.xSpeed = params.xs;
            this.ySpeed = params.ys;
            this.motionSpeed = Math.sqrt(this.xSpeed * this.xSpeed + this.ySpeed * this.ySpeed);
            this.motionAccel = params.ma;
        } else {
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
        }
        
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
        this.path.push(new Tuio.Point({
            ttime: this.currentTime,
            xp: this.xPos,
            yp: this.yPos
        }));

        if (this.motionAccel > 0) {
            this.state = Tuio.Container.TUIO_ACCELERATING;
        } else if (this.motionAccel < 0) {
            this.state = Tuio.Container.TUIO_DECELERATING;
        } else {
            this.state = Tuio.Container.TUIO_STOPPED;
        }
    },

    stop: function(ttime) {
        this.update({
            ttime: ttime,
            xp: this.xPos,
            yp: this.yPos
        });
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

    fromContainer: function(tcon) {
        return new Tuio.Container({
            xp: tcon.getX(),
            yp: tcon.getY(),
            si: tcon.getSessionID()
        });
    }
});