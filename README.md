# Tuio.js

Tuio.js is a JavaScript implementation of the [TUIO library](http://www.tuio.org) for multitouch and tangible interaction in the web browser. It brings a 1:1 port of the original [TUIO Java library](http://www.tuio.org/?java). 

### How it works
TUIO is based on the [OSC protocol](http://opensoundcontrol.org/) and usually transferred via UDP. Tuio.js uses node.js and Websockets ([Socket.io](http://socket.io/)) to push OSC/TUIO messages to the browser. TUIO.js converts the messages to events that applications can register with.

## Getting Started
### Server
*Install the server via npm:*  
npm install tuio  
(or: put the node_modules/tuio folder into your node_modules folder)

*Start the example server*  
node src/server.js  
(Modify server port in server.js if necessary. You also need to npm install [express](https://github.com/visionmedia/express) for the example server to work.)

### Client
Include dist/Tuio.min.js

```javascript
var client = new Tuio.Client({
    host: "http://localhost:5000"
}),

onAddTuioCursor = function(addCursor) {
  console.log(addCursor);
},

onUpdateTuioCursor = function(updateCursor) {
  console.log(updateCursor);
},

onRemoveTuioCursor = function(removeCursor) {
  console.log(removeCursor);
},

onAddTuioObject = function(addObject) {
    console.log(addObject);
},

onUpdateTuioObject = function(updateObject) {
    console.log(updateObject);
},

onRemoveTuioObject = function(removeObject) {
    console.log(removeObject);
},

onRefresh = function(time) {
  console.log(time);
};

client.on("addTuioCursor", onAddTuioCursor);
client.on("updateTuioCursor", onUpdateTuioCursor);
client.on("removeTuioCursor", onRemoveTuioCursor);
client.on("addTuioObject", onAddTuioObject);
client.on("updateTuioObject", onUpdateTuioObject);
client.on("removeTuioObject", onRemoveTuioObject);
client.on("refresh", onRefresh);
client.connect();
```

## Documentation
The API is modeled after the [TUIO Java library](http://www.tuio.org/?java). Also see the source and examples on how to use the library. In most cases, you probably only need some events (addTuioCursor, removeTuioObject, etc.) or the methods client.getTuioCursors() and client.getTuioObjects().

## Examples
_See examples folder_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## License
Licensed under the GPL license.