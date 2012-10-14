var arDrone = require('ar-drone')
,   tcpVideoStream = new arDrone.Client.PngStream.TcpVideoStream({timeout:9000})
,   Parser = require('./PaVEParser')

module.exports = function (cb) {
    console.log('Connecting to drone');
    tcpVideoStream.connect(function () {
        tcpVideoStream.on('close', function () {
            // TODO: try to reconnect
        })
        console.log('connected to drone.')
        var p = new Parser
        tcpVideoStream.pipe(p)
        cb(null, p)
    })
};
