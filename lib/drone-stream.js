var arDrone = require('ar-drone')
,   tcpVideoStream = new arDrone.Client.PngStream.TcpVideoStream({timeout:9000})

module.exports = function (cb) {
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
