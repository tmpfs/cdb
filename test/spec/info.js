var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should get server info', function(done) {
    var server = Server({server: process.env.COUCH});
    server.info(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.version).to.be.a('string');
      done();
    })     
  });

  it('should get server info with opts', function(done) {
    var server = Server();
    server.info({server: process.env.COUCH}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.version).to.be.a('string');
      done();
    })     
  });

});
