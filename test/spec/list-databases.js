var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should get database list', function(done) {
    var server = Server({server: process.env.COUCH});
    server.ls(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('array')
        .to.have.length.gt(0);
      done();
    })     
  });

  it('should get database list with opts', function(done) {
    var server = Server();
    server.ls({server: process.env.COUCH}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('array')
        .to.have.length.gt(0);
      done();
    })     
  });

});
