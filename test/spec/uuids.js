var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should get server uuids', function(done) {
    var server = Server({server: process.env.COUCH});
    server.uuids(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.uuids).to.be.an('array')
        .to.have.length.gt(0);
      done();
    })     
  });

  it('should get server uuids with opts', function(done) {
    var server = Server();
    server.uuids({server: process.env.COUCH}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.uuids).to.be.an('array')
        .to.have.length.gt(0);
      done();
    })     
  });

});
