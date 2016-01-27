var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should error on bad JSON string (deserialize)', function(done) {
    var server = Server({server: process.env.COUCH});
    // trigger an error in deserialize() by binding
    server.deserialize = server.deserialize.bind(server, '{');
    server.info(function(err, res) {
      expect(err).to.be.instanceof(Error);
      expect(res).to.be.an('object');
      done();
    })     
  });

});
