var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should get server tasks', function(done) {
    var server = Server({server: process.env.COUCH});
    server.tasks(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('array');
      done();
    })     
  });

  it('should get server tasks with opts', function(done) {
    var server = Server();
    server.tasks({server: process.env.COUCH}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('array');
      done();
    })     
  });

});
