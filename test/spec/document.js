var expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-document-db';

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

  it('should head document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document'
      }
    server.doc.head(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body.status).to.eql(200);
      expect(body.headers).to.be.an('object');
      expect(body.size).to.be.a('number');
      expect(body.rev).to.be.a('string');
      done();
    })     
  });

  it('should get document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document'
      }
    server.doc.get(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.bool).to.eql(true);
      done();
    })     
  });

  it('should error on missing document (remove)', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-missing-document'
      }
    server.doc.rm(opts, function(err, res) {
      expect(err).to.be.an('object');
      expect(err.status).to.eql(404);
      expect(res).to.be.an('object');
      done();
    })     
  });

  it('should copy document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        destination: 'mock-document-copy'
      }
    server.doc.cp(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.eql(opts.destination);
      expect(body.rev).to.be.a('string');
      done();
    })     
  });

  it('should remove document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document'
      }
    server.doc.rm(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.be.a('string');
      expect(body.rev).to.be.a('string');
      done();
    })     
  });

});
