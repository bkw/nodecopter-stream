var ffmpeg = require('./lib/ffmpeg')
,   drone = require('./lib/drone-stream')

module.exports = function (port) {
    // init ffmpeg
    ffmpeg(function(err, ffmpeg) {
        // get the pngs from teh drone
        drone(function(err, stream) {
            // pipe parser to ffmpeg
            stream.pipe(ffmpeg.stdin)
        })
    })
}
