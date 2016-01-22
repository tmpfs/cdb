var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  before(function(done) {
    var server = Server({server: process.env.COUCH});
    function onRemove() {
      done(); 
    }
    server.db.rm({db: 'mock-updates-db'}, onRemove);
  })

  it('should get server updates', function(done) {
    var server = Server({server: process.env.COUCH});
    var req = server.updates(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      server.db.rm({db: 'mock-updates-db'}, done);
    })
    req.once('response', function() {
      server.db.create({db: 'mock-updates-db'}, function(){})
    })
  });

  it('should get server updates with opts', function(done) {
    var server = Server({server: process.env.COUCH});
    var req = server.updates({qs: {feed: Server.feeds.longpoll}},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        server.db.rm({db: 'mock-updates-db'}, done);
      }
    )
    req.once('response', function() {
      server.db.create({db: 'mock-updates-db'}, function(){})
    })
  });

});
