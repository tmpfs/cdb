var expect = require('chai').expect
  , Server = require('../../index');

describe('cdb:', function() {
  var server = Server({server: process.env.COUCH});

  it('should use raw http client', function(done) {
    var opts = {
      url: [process.env.COUCH, ''].join('/'),
      method: 'PUT',
      body: '{}'
    };
    server.raw(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an.instanceof(Buffer);
      done();
    })
  });

});
