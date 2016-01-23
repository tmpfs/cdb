var expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-local-db';

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

  it('should create local document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        local: true,
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

  it('should get local document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        local: true
      }
    server.doc.get(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.bool).to.eql(true);
      done();
    })     
  });

  it('should copy local document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        destination: 'mock-document-copy',
        local: true
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

  it('should error on missing document (remove)', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-missing-document',
        local: true
      }
    server.doc.rm(opts, function(err, res) {
      expect(err).to.be.an('object');
      expect(err.status).to.eql(404);
      expect(res).to.be.an('object');
      done();
    })     
  });


  it('should remove local document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'mock-document',
        local: true
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
