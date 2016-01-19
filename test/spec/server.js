var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should create server instance', function(done) {
    var server = Server();
    expect(server).to.be.an('object');
    done();
  });

});
