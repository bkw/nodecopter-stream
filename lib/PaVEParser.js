// Based on PaVEParser by Felix Geisendörfer
// https://github.com/felixge/node-ar-drone/blob/master/lib/video/PaVEParser.js

// The AR Drone 2.0 allows a tcp client to receive H264 (MPEG4.10 AVC) video
// from the drone. However, the frames are wrapped by Parrot Video
// Encapsulation (PaVE), which this class parses.
'use strict';

var util   = require('util')
  , Stream = require('stream').Stream
  , buffy  = require('buffy')
  ;

module.exports = PaVEParser;
util.inherits(PaVEParser, Stream);
function PaVEParser() {
    Stream.call(this);

    this.writable = true;
    this.readable = true;

    this._parser = buffy.createReader();
    this._state  = 'header';
    this._toRead = undefined;
    // TODO: search forward in buffer to last I-Frame
    this._frame_type = undefined;
}

PaVEParser.HEADER_SIZE = 68; // 64 in older firmwares, but doesn't matter.

PaVEParser.prototype.write = function (buffer) {
    var parser = this._parser
      , signature
      , header_size
      , readable
      ;

    parser.write(buffer);

    while (true) {
        switch (this._state) {
        case 'header':
            if (parser.bytesAhead() < PaVEParser.HEADER_SIZE) {
                return;
            }
            signature = parser.ascii(4);

            if (signature !== 'PaVE') {
                // TODO: wait/look for next PaVE frame
                this.emit('error', new Error(
                    'Invalid signature: ' + JSON.stringify(signature)
                ));
            }

            parser.buffer(2);
            header_size = parser.uint16LE();
            // payload_size
            this._toRead = parser.uint32LE();
            // skip 18 bytes::
            // encoded_stream_width 2
            // encoded_stream_height 2
            // display_width 2
            // display_height 2
            // frame_number 4
            // timestamp 4
            // total_chunks 1
            // chunk_index 1
            parser.buffer(18);
            this._frame_type = parser.uint8();

            // bytes consumed so far: 4 + 2 + 2 + 4 + 18 + 1 = 31. Skip ahead.
            parser.buffer(header_size - 31);

            this._state = 'payload';
            break;

        case 'payload':
            readable = parser.bytesAhead();
            if (readable < this._toRead) {
                this.emit('data', parser.buffer(readable));
                this._toRead -= readable;
                return;
            }

            this.emit('data', parser.buffer(this._toRead));
            this._toRead = undefined;
            this._state = 'header';
            break;
        }
    }

    return true;
};

PaVEParser.prototype.end = function () {
    // nothing to do, just here so pipe() does not complain
};
