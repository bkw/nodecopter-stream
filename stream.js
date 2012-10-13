#!/usr/bin/env node

'use strict';

var arDrone = require('ar-drone')
  , parser = new (require(__dirname + '/lib/PaVEParser'))()
  , spawn = require('child_process').spawn
  , feedUrl = 'http://localhost:8090/nodecopter.ffm'
  , ffmpeg
  , ffserver = spawn('ffserver', ['-f', __dirname + '/ffserver.conf'])
  , shutdownInProgress = false;
  ;

var connectDrone = function (cb) {
    var tcpVideoStream = new arDrone.Client.PngStream.TcpVideoStream({
        timeout : 3000
    });
    console.log('Connecting to drone');
    tcpVideoStream.connect(function () {
        tcpVideoStream.on('close', function () {
            // TODO: try to reconnect
            gracefulShutdown();
        });
        console.log('connected to drone.');
        cb(tcpVideoStream);
    });
};

var launchFeed = function (cb) {
    ffmpeg = spawn('ffmpeg', [
        '-v', 'error',
        '-analyzeduration', 0,
        '-i', '-',
        // swing a dead cat in the general direction of the latency issues:
        '-fflags', '+genpts',
        '-quality', 'realtime',
        '-cpu-used', 5,
        '-speed', 5,
        feedUrl
    ]);
    ffmpeg.stderr.on('data', function (ffmpegerr) {
        console.error('ffmpeg error: ' + ffmpegerr);
    });

    ffmpeg.stdout.on('data', function (ffmpegout) {
        console.log('ffmpeg out: ' + ffmpegout);
    });
    ffmpeg.on('exit', function (code, signal) {
        console.log('ffmpeg exit', code, signal);
        gracefulShutdown(signal);
    });
    cb(ffmpeg);
};

var gracefulShutdown = function (signal) {
    if (! shutdownInProgress) {
        shutdownInProgress = true;
        ffmpeg.kill();
        ffserver.kill();
    }
    console.log('Exit on signal', signal);
    process.exit(0);
};



ffserver.stderr.on('data', function (ffsrverr) {
    console.error('ffserver error:', ffsrverr.toString());
});
ffserver.stdout.on('data', function (ffsrvout) {
    console.log('ffserver out:', ffsrvout.toString());
});
ffserver.on('exit', function (code, signal) {
    console.log('ffserver exit', code, signal);
    gracefulShutdown(signal);
});
// launch the rest as soon as we hear from ffserver:
ffserver.stdout.once('data', function () {
    launchFeed(function (ffmpeg) {
        connectDrone(function (tcpVideoStream) {
            tcpVideoStream.pipe(parser);
            parser.pipe(ffmpeg.stdin);
            console.log('receiving video stream');
        });
    });
});
process.on('SIGTERM', function () {
   gracefulShutdown('SIGTERM')
});
process.on('SIGINT', function () {
    gracefulShutdown('SIGINT');
});
process.on('uncaughtException', function(err) {
    console.error(err);
    gracefulShutdown();
});

/*
setInterval(function () {
    console.log(parser.getStats());
}, 3000);
*/


