var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should get server log tail', function(done) {
    var server = Server({server: process.env.COUCH});
    server.tail(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.a('string');
      done();
    })     
  });

  it('should get server log tail with opts', function(done) {
    var server = Server();
    server.tail({server: process.env.COUCH}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.a('string');
      done();
    })     
  });

});
