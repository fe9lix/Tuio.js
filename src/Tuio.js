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