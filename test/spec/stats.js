var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should get server stats', function(done) {
    var server = Server({server: process.env.COUCH});
    server.stats(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.httpd).to.be.an('object');
      done();
    })     
  });

  it('should get server stats with opts', function(done) {
    var server = Server();
    server.stats({server: process.env.COUCH}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.httpd).to.be.an('object');
      done();
    })     
  });

});
