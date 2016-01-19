var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should get session document', function(done) {
    var server = Server({server: process.env.COUCH});
    server.session.get(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should get session document with opts', function(done) {
    var server = Server();
    server.session.get({server: process.env.COUCH}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

});
