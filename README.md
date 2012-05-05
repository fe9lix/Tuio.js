## Tuio.js

Tuio.js is a JavaScript implementation of the [TUIO library](http://www.tuio.org) for multitouch and tangible interaction in the web browser. It aims to be a 1:1 port of the original TUIO Java library. 

### How it works
TUIO is based on the [OSC protocol](http://opensoundcontrol.org/) and usually transferred via UDP. Tuio.js uses node.js (the [node-osc library](https://github.com/TheAlphaNerd/node-osc) and Websockets ([Socket.io](http://socket.io/)) to push OSC/TUIO messages to the browser. TUIO.js converts the messages into events that applications can register with. Another utility translates TUIO events to standard HTML5 Touch API events + additional events for tangibles which are not part of the W3C spec.

## Usage

TBD

## License

The MIT License (MIT)
Copyright (c) 2012 Felix Raab

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.