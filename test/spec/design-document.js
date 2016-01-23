var expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-ddoc-db';

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

  it('should create ddoc document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        ddoc: true,
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

  it('should head ddoc document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        ddoc: true
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

  it('should get ddoc document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        ddoc: true
      }
    server.doc.get(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.bool).to.eql(true);
      done();
    })     
  });

  it('should copy ddoc document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        destination: 'mock-document-copy',
        ddoc: true
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

  it('should remove ddoc document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        ddoc: true
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
