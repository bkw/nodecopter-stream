#!/usr/bin/env node

'use strict';

var parser = new (require(__dirname + '/lib/PaVEParser'))()
  , shutdownInProgress = false
  , fs = require('fs')
  , path = require('path')
  , dataFeedFile = path.join(__dirname, 'data', 'nodecopter.ffm')
  , ffserver = require('./lib/ffserver')  
  , ffmpeg = require('./lib/ffmpeg')
  , drone = require('./lib/drone-stream')

// init ffserver
ffserver(function() {

    // init ffmpeg
    ffmpeg(function(ffmpeg) {
        
        // pipe drone pngs to ffmpeg
        drone(function(tcpVideoStream) {

            tcpVideoStream.pipe(parser)
            parser.pipe(ffmpeg.stdin)
            // console.log('receiving video stream');
        });
    });
})



var gracefulShutdown = function (signal) {
    if (! shutdownInProgress) {
        shutdownInProgress = true;
        // ffmpeg.kill();
        // ffserver.kill();
    }
    console.log('Exit on signal', signal);
    process.exit(0);
}

process.on('SIGTERM', function () {
   gracefulShutdown('SIGTERM')
})

process.on('SIGINT', function () {
    gracefulShutdown('SIGINT');
})

process.on('uncaughtException', function(err) {
    console.error(err);
    gracefulShutdown();
})
