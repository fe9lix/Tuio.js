var TuioCanvas = {
    init: function() {
        this.Main.init();
    }
};

TuioCanvas.Main = (function() {
    var client = null,
    screenW = null,
    screenH = null,
    time = null,
    canvas = null,
    context = null,

    init = function() {
        screenW = $(document).width();
        screenH = $(document).height();
        time = new Date().getTime();
        canvas = $("#tuioCanvas").get(0);
        canvas.width = screenW;
        canvas.height = screenH;
        context = canvas.getContext("2d");

        initClient();
    },

    initClient = function() {
        client = new Tuio.Client({
            host: "http://localhost:5000"
        });
        client.on("connect", onConnect);
        client.connect();
    },

    onConnect = function() {
        draw();
    },

    draw = function() {
        requestAnimationFrame(draw);

        canvas.width = canvas.width;

        var cursors = client.getTuioCursors(),
        objects = client.getTuioObjects();

        for (var i in cursors) {
            drawCursor(cursors[i]);
        }

        for (var i in objects) {
            drawObject(objects[i]);
        }
    },

    drawCursor = function(cursor) {
        context.fillStyle = "#009fe3";
        context.arc(
            cursor.getScreenX(screenW),
            cursor.getScreenY(screenH),
            25,
            0,
            Math.PI * 2
        );
        context.fill();
    },

    drawObject = function(object) {
        context.save();
        context.translate(object.getScreenX(screenW), object.getScreenY(screenH));
        context.rotate(object.getAngle());
        context.fillStyle = "#ffffff";
        context.fillRect(
            0,
            0,
            50,
            50
        );
        context.fill();
        context.restore();
    };

    return {
        init: init
    };
}());