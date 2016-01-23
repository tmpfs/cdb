var expect = require('chai').expect
  , Server = require('../../index');

describe('cdb:', function() {

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


  it('should make request as noop', function(done) {
    // clear request cache
    server.flush();

    function fn() {
      server.repeat();
    }

    expect(fn).throws(/no request available to repeat/i)

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


  it('should repeat request', function(done) {
    server.repeat(function(err) {
      expect(err).to.be.instanceof(Error);
      expect(err.status).to.eql(-1);
      expect(err.reason).to.eql('noop');
      expect(err.code).to.eql('ENOOP');
      done();
    })     
  });

});
