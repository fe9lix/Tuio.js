# Tuio.js

Tuio.js is a JavaScript implementation of the [TUIO library](http://www.tuio.org) for multitouch and tangible interaction in the web browser. It aims to be a 1:1 port of the original TUIO Java library. 

### How it works
TUIO is based on the [OSC protocol](http://opensoundcontrol.org/) and usually transferred via UDP. Tuio.js uses node.js (the [node-osc library](https://github.com/TheAlphaNerd/node-osc) and Websockets ([Socket.io](http://socket.io/)) to push OSC/TUIO messages to the browser. TUIO.js converts the messages into events that applications can register with. Another utility translates TUIO events to standard HTML5 Touch API events + additional events for tangibles which are not part of the W3C spec.

## Getting Started
_(Coming soon)_

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/cowboy/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 Felix Raab  
Licensed under the MIT license.