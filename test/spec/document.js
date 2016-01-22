var expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-db';

describe('cdb:', function() {

  before(function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.add(function(err) {
      done(err);
    })     
  })

  after(function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.rm(function(err) {
      done(err);
    })     
  })

  it('should create document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        body: {
          bool: true
        }      
      }
    server.doc.add(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.be.a('string');
      expect(body.rev).to.be.a('string');
      done();
    })     
  });

});
