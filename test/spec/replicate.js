var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  var server = Server({server: process.env.COUCH});

  before(function(done) {
    server.db.create({db: 'repl-source'}, function(err) {
      if(err) {
        return done(err);
      }
      server.db.create({db: 'repl-target'}, function(err) {
        done(err);
      }) 
    }) 
  })

  after(function(done) {
    server.db.rm({db: 'repl-source'}, function(err) {
      if(err) {
        return done(err);
      }
      server.db.rm({db: 'repl-target'}, function(err) {
        done(err);
      }) 
    }) 
  })

  it('should replicate database', function(done) {
    function onRepl(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    }
    server.replicate(
      {body: {source: 'repl-source', target: 'repl-target'}}, onRepl);
  });

});
