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