var mkdirp  = require('mkdirp')
,   fs      = require('fs')
,   path    = require('path')
,   conf    = path.join(__dirname, '..', 'ffserver.conf')
,   feeddir = path.join(__dirname, '..', 'data')
,   feed    = path.join(feeddir, 'nodecopter.ffm')
,   spawn   = require('child_process').spawn

module.exports = function(cb) {
    // create a swap file
    mkdirp(feeddir, function(err) {
        
        fs.writeFileSync(feed)

        // kick up the server
        var ffserver = spawn('ffserver', ['-f', conf])

        ffserver.stderr.on('data', function (ffsrverr) {
            console.error('ffserver error:', ffsrverr.toString());
        });

        ffserver.stdout.on('data', function (ffsrvout) {
            console.log('ffserver out:', ffsrvout.toString());
        });

        ffserver.on('exit', function (code, signal) {
            console.log('ffserver exit', code, signal);
            // gracefulShutdown(signal);
            fs.unlink(feed)
        });

        // launch the rest as soon as we hear from ffserver:
        ffserver.stdout.once('data', cb)
    })
}
