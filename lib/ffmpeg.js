var spawn = require('child_process').spawn
,   feedUrl = 'http://localhost:8090/nodecopter.ffm'

module.exports = function (cb) {

    var ffmpeg = spawn('ffmpeg', [
        '-v', 'error',
        '-analyzeduration', 0,
        '-i', '-',
        // swing a dead cat in the general direction of the latency issues:
        '-fflags', '+genpts',
        '-quality', 'realtime',
        '-cpu-used', 5,
        '-speed', 5,
        feedUrl
    ])

    /*
    ffmpeg.stderr.on('data', function (ffmpegerr) {
        console.error('ffmpeg error: ' + ffmpegerr);
    })

    ffmpeg.stdout.on('data', function (ffmpegout) {
        console.log('ffmpeg out: ' + ffmpegout);
    })
        
    ffmpeg.on('exit', function (code, signal) {
            console.log('ffmpeg exit', code, signal);
            gracefulShutdown(signal);
        })
    */

    cb(ffmpeg)
}
