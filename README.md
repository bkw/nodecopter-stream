## nodecopter-stream

html5 live stream from your 
[Parrot AR Drone 2.0](http://ardrone2.parrot.com/).

This is a proof of concept implementation using ffmpeg and ffserver and
a webm live stream.

You need a recend version of ffmpeg (together with ffserver) installed.


Install via Github to get the *latest* version:

```bash
npm install git://github.com/bkw/nodecopter-stream.git
```

Launch the server:
```bash
node stream.js
```

... and then open index.html in a recent browser (firefox, chrome, opera).


##TODO

* implement more stream types (HLS!)

* compensate tcp latency by dropping frames until the last I-Frame in the
  buffer, see:
  * https://projects.ardrone.org/boards/1/topics/show/4282,
  * https://projects.ardrone.org/attachments/450/paveparse.zip

* experiment with different encodings, bitrates and other ffserver settings

* make sure ffserver exists on process exit

* reduce CPU usage of node (suspect: parsing frames that could be dropped)