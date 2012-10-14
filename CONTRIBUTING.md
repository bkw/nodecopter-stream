# Contributing

## Running the test suite

```js
$ git clone <git url>
$ cd <clone dir>
$ npm install -d
$ npm test
```

## Running an individual test

```js
% ./node_modules/.bin/jasmine-node spec/drone-stream.spec.js
```

## TODOS

Any help with making this module better is greatly appreciated.
Especially the following areas need some love:

* tweak fferserver.conf settings and ffmpeg arguments for less latency and/or
  less cpu consumption

* make the whole chain of TcpVideoStream -> Parser -> ffmpeg -> ffserver
  more resilient (in descending order of priority);

  * handle timeouts from tcpVideoStream

  * handle errors from PaVEParser (invalid signature, search forward for next)

  * handle unexpected exits from ffmpeg and restart

  * handle ffserver exits

Merging your improvements will be much smoother if you create a separate branch
for every selfcontained feature and issue a pullreq from there.

