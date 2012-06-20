/*! Tuio.js - v0.0.1 - 2012-06-20
* http://fe9lix.github.com/Tuio.js/
* Copyright (c) 2012 Felix Raab; Licensed GPL */

(function(root) {
    // Initial Setup, events mixin and extend/inherits taken from Backbone.js
    // See Backbone.js source for original version and comments.

    var previousTuio = root.Tuio;

    var slice = Array.prototype.slice;
    var splice = Array.prototype.splice;

    var Tuio;
    if (typeof exports !== "undefined") {
        Tuio = exports;
    } else {
        Tuio = root.Tuio = {};
    }

    Tuio.VERSION = "0.0.1";

    var _ = root._;

    if (!_ && (typeof require !== "undefined")) {
        _ = require("lodash");
    }

    Tuio.noConflict = function() {
        root.Tuio = previousTuio;
        return this;
    };

    var eventSplitter = /\s+/;

    var Events = Tuio.Events = {
        on: function(events, callback, context) {
            var calls, event, node, tail, list;
            if (!callback) {
                return this;
            }
            events = events.split(eventSplitter);
            calls = this._callbacks || (this._callbacks = {});

            while (event = events.shift()) {
                list = calls[event];
                node = list ? list.tail : {};
                node.next = tail = {};
                node.context = context;
                node.callback = callback;
                calls[event] = {tail: tail, next: list ? list.next : node};
            }

            return this;
        },

        off: function(events, callback, context) {
            var event, calls, node, tail, cb, ctx;

            if (!(calls = this._callbacks)) {
                return;
            }
            if (!(events || callback || context)) {
                delete this._callbacks;
                return this;
            }

            events = events ? events.split(eventSplitter) : _.keys(calls);
            while (event = events.shift()) {
                node = calls[event];
                delete calls[event];
                if (!node || !(callback || context)) {
                    continue;
                }
                tail = node.tail;
                while ((node = node.next) !== tail) {
                    cb = node.callback;
                    ctx = node.context;
                    if ((callback && cb !== callback) || (context && ctx !== context)) {
                        this.on(event, cb, ctx);
                    }
                }
            }

          return this;
        },

        trigger: function(events) {
            var event, node, calls, tail, args, all, rest;
            if (!(calls = this._callbacks)) {
                return this;
            }
            all = calls.all;
            events = events.split(eventSplitter);
            rest = slice.call(arguments, 1);

            while (event = events.shift()) {
                if (node = calls[event]) {
                    tail = node.tail;
                    while ((node = node.next) !== tail) {
                        node.callback.apply(node.context || this, rest);
                    }
                }
                if (node = all) {
                    tail = node.tail;
                    args = [event].concat(rest);
                    while ((node = node.next) !== tail) {
                        node.callback.apply(node.context || this, args);
                    }
                }
            }

            return this;
        }
    };

    var Model = Tuio.Model = function() {
        this.initialize.apply(this, arguments);
    };

    _.extend(Model.prototype, Events);

    var extend = function (protoProps, classProps) {
        var child = inherits(this, protoProps, classProps);
        child.extend = this.extend;
        return child;
    };

    Tuio.Model.extend = extend;

    var Ctor = function() {

    };

    var inherits = function(parent, protoProps, staticProps) {
        var child;

        if (protoProps && protoProps.hasOwnProperty("constructor")) {
            child = protoProps.constructor;
        } else {
            child = function() {
                parent.apply(this, arguments);
            };
        }

        _.extend(child, parent);

        Ctor.prototype = parent.prototype;
        child.prototype = new Ctor();

        if (protoProps) {
            _.extend(child.prototype, protoProps);
        }

        if (staticProps) {
            _.extend(child, staticProps);
        }

        child.prototype.constructor = child;

        child.__super__ = parent.prototype;

        return child;
    };
}(this));
Tuio.Time = Tuio.Model.extend({
    seconds: 0,
    microSeconds: 0,

    initialize: function(sec, usec) {
        this.seconds = sec || 0;
        this.microSeconds = usec || 0;
    },

    add: function(us) {
        return new Tuio.Time(
            this.seconds + Math.floor(us / 1000000),
            this.microSeconds + us % 1000000
        );
    },

    addTime: function(ttime) {
        var sec = this.seconds + ttime.getSeconds(),
        usec = this.microSeconds + ttime.getMicroseconds();
        sec += Math.floor(usec / 1000000);
        usec = usec % 1000000;
        
        return new Tuio.Time(sec, usec);
    },

    subtract: function(us) {
        var sec = this.seconds - Math.floor(us / 1000000),
        usec = this.microSeconds - us % 1000000;
        
        if (usec < 0) {
            usec += 1000000;
            sec = sec - 1;
        }
        
        return new Tuio.Time(sec, usec);
    },

    subtractTime: function(ttime) {
        var sec = this.seconds - ttime.getSeconds(),
        usec = this.microSeconds - ttime.getMicroseconds();

        if (usec < 0) {
            usec += 1000000;
            sec = sec - 1;
        }
        
        return new Tuio.Time(sec, usec);
    },

    equals: function(ttime) {
        return (
            (this.seconds === ttime.getSeconds()) &&
            (this.microSeconds === ttime.getMicroseconds())
        );
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

    fromMilliseconds: function(msec) {
        return new Tuio.Time(
            Math.floor(msec / 1000),
            1000 * (msec % 1000)
        );
    },

    fromTime: function(ttime) {
        return new Tuio.Time(
            ttime.getSeconds(),
            ttime.getMicroseconds()
        );
    },

    initSession: function() {
        var startTime = Tuio.Time.getSystemTime();
        Tuio.Time.startSeconds = startTime.getSeconds();
        Tuio.Time.startMicroSeconds = startTime.getMicroseconds();
    },

    getSessionTime: function() {
        return Tuio.Time.getSystemTime().subtractTime(Tuio.Time.getStartTime());
    },

    getStartTime: function() {
        return new Tuio.Time(
            Tuio.Time.startSeconds,
            Tuio.Time.startMicroSeconds
        );
    },

    getSystemTime: function() {
        var usec = new Date().getTime() * 1000;

        return new Tuio.Time(
            Math.floor(usec / 1000000),
            usec % 1000000
        );
    }
});
Tuio.Point = Tuio.Model.extend({
    xPos: null,
    yPos: null,
    currentTime: null,
    startTime: null,

    initialize: function(params) {
        this.xPos = params.xp || 0;
        this.yPos = params.yp || 0;
        this.currentTime = Tuio.Time.fromTime(params.ttime || Tuio.Time.getSessionTime());
        this.startTime = Tuio.Time.fromTime(this.currentTime);
    },

    update: function(params) {
        this.xPos = params.xp;
        this.yPos = params.yp;
        if (params.hasOwnProperty("ttime")) {
            this.currentTime = Tuio.Time.fromTime(params.ttime);
        }
    },

    updateToPoint: function(tpoint) {
        this.xPos = tpoint.getX();
        this.yPos = tpoint.getY();
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
        return new Tuio.Point({
            xp: tpoint.getX(),
            yp: tpoint.getY()
        });
    }
});
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
Tuio.Cursor = Tuio.Container.extend({
    cursorId: null,

    initialize: function(params) {
        Tuio.Container.prototype.initialize.call(this, params);

        this.cursorId = params.ci;
    },

    getCursorId: function() {
        return this.cursorId;
    }
}, {
    fromCursor: function(tcur) {
        return new Tuio.Cursor({
            si: tcur.getSessionId(),
            ci: tcur.getCursorId(),
            xp: tcur.getX(),
            yp: tcur.getY()
        });
    }
});
Tuio.Object = Tuio.Container.extend({
    symbolId: null,
    angle: null,
    rotationSpeed: null,
    rotationAccel: null,

    initialize: function(params) {
        Tuio.Container.prototype.initialize.call(this, params);

        this.symbolId = params.sym;
        this.angle = params.a;
        this.rotationSpeed = 0;
        this.rotationAccel = 0;
    },

    update: function(params) {
        var lastPoint = this.path[this.path.length - 1];
        Tuio.Container.prototype.update.call(this, params);

        if (
            params.hasOwnProperty("rs") &&
            params.hasOwnProperty("ra")) {

            this.angle = params.a;
            this.rotationSpeed = params.rs;
            this.rotationAccel = params.ra;
        } else {
            var diffTime = this.currentTime.subtractTime(lastPoint.getTuioTime()),
            dt = diffTime.getTotalMilliseconds() / 1000,
            lastAngle = this.angle,
            lastRotationSpeed = this.rotationSpeed;
            this.angle = params.a;

            var da = (this.angle - lastAngle) / (2 * Math.PI);
            if (da > 0.75) {
                da -= 1;
            } else if (da < -0.75) {
                da += 1;
            }
            
            this.rotationSpeed = da / dt;
            this.rotationAccel = (this.rotationSpeed - lastRotationSpeed) / dt;
        }

        this.updateObjectState();
    },

    updateObject: function(tobj) {
        Tuio.Container.prototype.updateContainer.call(this, tobj);

        this.angle = tobj.getAngle();
        this.rotationSpeed = tobj.getRotationSpeed();
        this.rotationAccel = tobj.getRotationAccel();
        
        this.updateObjectState();
    },

    updateObjectState: function() {
        if ((this.rotationAccel !== 0) && (this.state !== Tuio.Object.TUIO_STOPPED)) {
            this.state = Tuio.Object.TUIO_ROTATING;
        }
    },

    stop: function(ttime) {
        this.update({
            ttime: ttime,
            xp: this.xPos,
            yp: this.yPos,
            a: this.angle
        });
    },

    getSymbolId: function() {
        return this.symbolId;
    },

    getAngle: function() {
        return this.angle;
    },

    getAngleDegrees: function() {
        return this.angle / Math.PI * 180;
    },

    getRotationSpeed: function() {
        return this.rotationSpeed;
    },

    getRotationAccel: function() {
        return this.rotationAccel;
    },

    isMoving: function() {
        return (
            (this.state === Tuio.Object.TUIO_ACCELERATING) ||
            (this.state === Tuio.Object.TUIO_DECELERATING) ||
            (this.state === Tuio.Object.TUIO_ROTATING)
        );
    }
}, {
    TUIO_ROTATING: 5,

    fromObject: function(tobj) {
        return new Tuio.Object({
            xp: tobj.getX(),
            yp: tobj.getY(),
            si: tobj.getSessionID(),
            sym: tobj.getSymbolId(),
            a: tobj.getAngle()
        });
    }
});
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
        this.trigger("connect");
    },

    onDisconnect: function() {
        this.connected = false;
        this.trigger("disconnect");
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
        var sid = args[0],
        cid = args[1],
        xPos = args[2],
        yPos = args[3],
        angle = args[4],
        xSpeed = args[5],
        ySpeed = args[6],
        rSpeed = args[7],
        mAccel = args[8],
        rAccel = args[9];

       if (!_.has(this.objectList, sid)) {
            var addObject = new Tuio.Object({
                si: sid,
                sym: cid,
                xp: xPos,
                yp: yPos,
                a: angle
            });
            this.frameObjects.push(addObject);
        } else {
            var tobj = this.objectList[sid];
            if (!tobj) {
                return;
            }
            if (
                (tobj.xPos !== xPos) ||
                (tobj.yPos !== yPos) ||
                (tobj.angle !== angle) ||
                (tobj.xSpeed !== xSpeed) ||
                (tobj.ySpeed !== ySpeed) ||
                (tobj.rotationSpeed !== rSpeed) ||
                (tobj.motionAccel !== mAccel) ||
                (tobj.rotationAccel !== rAccel)) {

                var updateObject = new Tuio.Object({
                    si: sid,
                    sym: cid,
                    xp: xPos,
                    yp: yPos,
                    a: angle
                });
                updateObject.update({
                    xp: xPos,
                    yp: yPos,
                    a: angle,
                    xs: xSpeed,
                    ys: ySpeed,
                    rs: rSpeed,
                    ma: mAccel,
                    ra: rAccel
                });
                this.frameObjects.push(updateObject);
            }
        }
    },

    objectAlive: function(args) {
        var removeObject = null;
        this.newObjectList = args;
        this.aliveObjectList = _.difference(this.aliveObjectList, this.newObjectList);

        for (var i = 0, max = this.aliveObjectList.length; i < max; i++) {
            removeObject = this.objectList[this.aliveObjectList[i]];
            if (removeObject) {
                removeObject.remove(this.currentTime);
                this.frameObjects.push(removeObject);
            }
        }
    },

    objectFseq: function(args) {
        var fseq = args[0],
        lateFrame = false,
        tobj = null;

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
            for (var i = 0, max = this.frameObjects.length; i < max; i++) {
                tobj = this.frameObjects[i];
                switch (tobj.getTuioState()) {
                    case Tuio.Object.TUIO_REMOVED:
                        this.objectRemoved(tobj);
                        break;
                    case Tuio.Object.TUIO_ADDED:
                        this.objectAdded(tobj);
                        break;
                    default:
                        this.objectDefault(tobj);
                        break;
                }
            }

            this.trigger("refresh", Tuio.Time.fromTime(this.currentTime));

            var buffer = this.aliveObjectList;
            this.aliveObjectList = this.newObjectList;
            this.newObjectList = buffer;
        }

        this.frameObjects = [];
    },

    objectRemoved: function(tobj) {
        var removeObject = tobj;
        removeObject.remove(this.currentTime);
        this.trigger("removeTuioObject", removeObject);
        delete this.objectList[removeObject.getSessionId()];
    },

    objectAdded: function(tobj) {
        var addObject = new Tuio.Object({
            ttime: this.currentTime,
            si: tobj.getSessionId(),
            sym: tobj.getSymbolId(),
            xp: tobj.getX(),
            yp: tobj.getY(),
            a: tobj.getAngle()
        });
        this.objectList[addObject.getSessionId()] = addObject;
        this.trigger("addTuioObject", addObject);
    },

    objectDefault: function(tobj) {
        var updateObject = this.objectList[tobj.getSessionId()];
        if (
            (tobj.getX() !== updateObject.getX() && tobj.getXSpeed() === 0) ||
            (tobj.getY() !== updateObject.getY() && tobj.getYSpeed() === 0)) {

            updateObject.update({
                ttime: this.currentTime,
                xp: tobj.getX(),
                yp: tobj.getY(),
                a: tobj.getAngle()
            });
        } else {
            updateObject.update({
                ttime: this.currentTime,
                xp: tobj.getX(),
                yp: tobj.getY(),
                a: tobj.getAngle(),
                xs: tobj.getXSpeed(),
                ys: tobj.getYSpeed(),
                rs: tobj.getRotationSpeed(),
                ma: tobj.getMotionAccel(),
                ra: tobj.getRotationAccel()
            });
        }
        
        this.trigger("updateTuioObject", updateObject);
    },

    cursorSet: function(args) {
        var sid = args[0],
        xPos = args[1],
        yPos = args[2],
        xSpeed = args[3],
        ySpeed = args[4],
        mAccel = args[5];

        if (!_.has(this.cursorList, sid)) {
            var addCursor = new Tuio.Cursor({
                si: sid,
                ci: -1,
                xp: xPos,
                yp: yPos
            });
            this.frameCursors.push(addCursor);
        } else {
            var tcur = this.cursorList[sid];
            if (!tcur) {
                return;
            }
            if (
                (tcur.xPos !== xPos) ||
                (tcur.yPos !== yPos) ||
                (tcur.xSpeed !== xSpeed) ||
                (tcur.ySpeed !== ySpeed) ||
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
        }
    },

    cursorAlive: function(args) {
        var removeCursor = null;
        this.newCursorList = args;
        this.aliveCursorList = _.difference(this.aliveCursorList, this.newCursorList);

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
        tcur = null;

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
                        this.cursorRemoved(tcur);
                        break;
                    case Tuio.Cursor.TUIO_ADDED:
                        this.cursorAdded(tcur);
                        break;
                    default:
                        this.cursorDefault(tcur);
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

    cursorRemoved: function(tcur) {
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

    cursorAdded: function(tcur) {
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

    cursorDefault: function(tcur) {
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