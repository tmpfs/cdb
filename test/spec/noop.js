var expect = require('chai').expect
  , Server = require('../../index');

describe('cdb:', function() {

  it('should make request as noop', function(done) {
    var server = Server()
      , opts = {
        method: 'get',
        url: process.env.COUCH,
        headers: {
          'Referer': process.env.COUCH,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id: 'mock-post-document'})
      }

    // clear request cache
    server.flush();

    expect(server.peek()).to.eql(null);

    server.request(opts, {noop: true}, function(err) {
      expect(server.peek()).to.be.an('object');
      expect(server.peek().req).to.be.an('object');
      expect(server.peek().req).to.eql(opts);

      expect(err).to.be.instanceof(Error);
      expect(err.status).to.eql(-1);
      expect(err.reason).to.eql('noop');
      expect(err.code).to.eql('ENOOP');
      done();
    })     
  });

});
