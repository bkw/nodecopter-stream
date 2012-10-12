#!/usr/bin/env node

'use strict';

var arDrone = require('ar-drone')
  , parser = new (require(__dirname + '/lib/PaVEParserOrig'))()
  , spawn = require('child_process').spawn
  , tcpVideoStream = new arDrone.Client.PngStream.TcpVideoStream()
  , feedUrl = 'http://localhost:8090/nodecopter.ffm'
  , ffmpeg = spawn('ffmpeg', ['-i', '-', feedUrl])
  , ffserver = spawn('ffserver', ['-f', __dirname + '/ffserver.conf'])
  ;

parser.pipe(ffmpeg.stdin);
tcpVideoStream.pipe(parser);
tcpVideoStream.connect();

