var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should error on bad JSON string (deserialize)', function(done) {
    var server = Server({server: process.env.COUCH});
    // trigger an error in deserialize() by binding?
    server.deserialize = server.deserialize.bind(server, '{');
    server.info(function(err, res, body) {
      console.dir(arguments);
      //expect(err).to.eql(null);
      //expect(res).to.be.an('object');
      //expect(body).to.be.an('object');
      //expect(body.version).to.be.a('string');
      done();
    })     
  });

});
