# Tuio.js

Tuio.js is a JavaScript implementation of the [TUIO library](http://www.tuio.org) for multitouch and tangible interaction in the web browser. It aims to be a 1:1 port of the original [TUIO Java library](http://www.tuio.org/?java). 

### How it works
TUIO is based on the [OSC protocol](http://opensoundcontrol.org/) and usually transferred via UDP. Tuio.js uses node.js (the [node-osc library](https://github.com/TheAlphaNerd/node-osc)) and Websockets ([Socket.io](http://socket.io/)) to push OSC/TUIO messages to the browser. TUIO.js converts the messages into events that applications can register with. Another utility translates TUIO events to standard HTML5 Touch API events + additional events for tangibles which are not part of the W3C spec.

## Getting Started
### Server
_(Coming soon)_

### Client
Include Tuio.min.js

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
_(Coming soon)_

## Examples
_See examples folder_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## Release History
_(Nothing yet)_

## License
Licensed under the GPL license.