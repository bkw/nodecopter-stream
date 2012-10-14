var parser = new (require(__dirname + '/lib/PaVEParser'))()
  , ffserver = require('./lib/ffserver')  
  , ffmpeg = require('./lib/ffmpeg')
  , drone = require('./lib/drone-stream')

module.exports = function() {
    // init ffserver
    ffserver(function() {
        // init ffmpeg
        ffmpeg(function(ffmpeg) {
            // get the pngs from teh drone
            drone(function(tcpVideoStream) {
                // pipe stream the parser
                tcpVideoStream.pipe(parser)
                // pipe parser to ffmpeg
                parser.pipe(ffmpeg.stdin)
            });
        });
    })
}
