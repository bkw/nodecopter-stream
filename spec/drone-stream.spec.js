var ds = require('./../lib/drone-stream')

describe('drone-stream', function(){

    it('should exist, thus demonstrating sanity', function() {
        expect(ds).not.toBeNull()
    })

    it('should return a pave stream thing', function(done){
        ds(function(err, stream) {
            expect(stream).not.toBeNull()
            done()
        })
    })

    // EOD
})
