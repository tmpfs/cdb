var expect = require('chai').expect
  , Server = require('../../index');

describe('cdb:', function() {

  it('should make request as noop', function(done) {
    var server = Server()
      , opts = {
        noop: true,
        method: 'get',
        url: process.env.COUCH,
        headers: {
          'Referer': process.env.COUCH,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id: 'mock-post-document'})
      }
    server.request(opts, {noop: true}, function(err) {
      expect(err).to.be.instanceof(Error);
      expect(err.status).to.eql(-1);
      expect(err.reason).to.eql('noop');
      expect(err.code).to.eql('ENOOP');
      done();
    })     
  });

});
