## nodecopter-stream

browser live stream from your 
[Parrot AR Drone 2.0](http://ardrone2.parrot.com/).

This is a proof of concept implementation using ffmpeg and ffserver and
a mjpeg live stream.

You need a recent version of ffmpeg (together with ffserver) installed.

Known to work is ffmpeg 0.11.1.git-1ad63ff (ffmpeg-devel from macports).


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

* experiment with different encodings, bitrates and other ffserver settings

* check whether webm endocing has improved with ffmpeg 1.0
