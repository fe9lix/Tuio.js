(function(root) {
    // Initial Setup and extend/inherits taken from Backbone.js
    // Comments removed, formatting changed.
    // See Backbone.js source for original version.

    var previousTuio = root.Tuio,
    Tuio,
    _ = root._,

    extend = function (protoProps, classProps) {
        var child = inherits(this, protoProps, classProps);
        child.extend = this.extend;
        return child;
    },

    Ctor = function() {

    },

    inherits = function(parent, protoProps, staticProps) {
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

    if (typeof exports !== "undefined") {
        Tuio = exports;
    } else {
        Tuio = root.Tuio = {};
    }

    Tuio.VERSION = "0.0.1";

    if (!_ && (typeof require !== "undefined")) {
        _ = require("lodash");
    }

    Tuio.noConflict = function() {
        root.Tuio = previousTuio;
        return this;
    };

    Tuio.Model = function() {
        this.initialize.apply(this, arguments);
    };

    Tuio.Model.extend = extend;
}(this));