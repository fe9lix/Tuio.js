Tuio.Cursor = Tuio.Container.extend({
	cursorId: null,

	initialize: function() {

	},

	initializeFromTime: function(ttime, si, ci, xp, yp) {
		Tuio.Container.prototype.initializeFromTime.call(this, ttime, si, xp, yp);
		this.cursorId = ci;
	},

	initializeFromPosition: function(si, ci, xp, yp) {
		Tuio.Container.prototype.initializeFromPosition.call(this, si, xp, yp);
		this.cursorId = ci;
	},

	initializeFromCursor: function(tcur) {
		Tuio.Container.prototype.initializeFromContainer.call(this, tcur);
		this.cursorId = tcur.getCursorId();
	},

	getCursorId: function() {
		return this.cursorId;
	}
}, {
	fromTime: function(ttime, si, ci, xp, yp) {
		var cursor = new Tuio.Cursor();
		cursor.initializeFromTime(ttime, si, ci, xp, yp);
		return cursor;
	},

	fromPosition: function(si, ci, xp, yp) {
		var cursor = new Tuio.Cursor();
		cursor.initializeFromPosition(si, ci, xp, yp);
		return cursor;
	},

	fromCursor: function(tcur) {
		var cursor = new Tuio.Cursor();
		cursor.initializeFromCursor(tcur);
		return cursor;
	}
});