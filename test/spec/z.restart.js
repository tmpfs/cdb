var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should restart server', function(done) {
    var server = Server({server: process.env.COUCH});
    server.restart(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      done();
      //setTimeout(done, 10000);
    })     
  });

  // NOTE: removed as it times out on the CI server

  //it('should restart server with opts', function(done) {
    //var server = Server();
    //server.restart({server: process.env.COUCH}, function(err, res, body) {
      //expect(err).to.eql(null);
      //expect(res).to.be.an('object');
      //expect(body).to.be.an('object');
      //setTimeout(done, 10000);
    //})     
  //});

});
