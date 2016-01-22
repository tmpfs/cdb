var expect = require('chai').expect
  , Server = require('../../index')
  , CouchError = require('../../lib/error')
  , database = 'mock-db';

describe('cdb:', function() {

  it('should head database (404)', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.head(function(err, res, body) {
      expect(err).to.be.an('object');
      expect(err).to.be.instanceof(CouchError)
      expect(err.status).to.eql(404);
      expect(err.reason).to.eql('not_found');
      expect(err.getErrorKey()).to.eql('ENOT_FOUND');
      expect(res).to.be.an('object');
      expect(body).to.eql('');
      done();
    })     
  });

  it('should create database', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.add(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })     
  });

  it('should head database', function(done) {
    var server = Server();
    server.db.head({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.eql('');
        done();
      }
    )     
  });

  it('should get database info', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.info(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.db_name).to.eql(database);
      done();
    })
  });

  it('should get database info with opts', function(done) {
    var server = Server();
    server.db.info({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.db_name).to.eql(database);
        done();
      }
    )
  });

  it('should get all docs', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.all(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.total_rows).to.be.a('number');
      expect(body.offset).to.be.a('number');
      expect(body.rows).to.be.an('array');
      done();
    })
  });

  it('should get all docs with opts', function(done) {
    var server = Server();
    server.db.all({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.total_rows).to.be.a('number');
        expect(body.offset).to.be.a('number');
        expect(body.rows).to.be.an('array');
        done();
      }
    )
  });

  it('should commit database', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.commit(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should commit database with opts', function(done) {
    var server = Server();
    server.db.commit({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.ok).to.eql(true);
        done();
      }
    )
  });

  it('should compact database', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.compact(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should compact database with opts', function(done) {
    var server = Server();
    server.db.compact({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.ok).to.eql(true);
        done();
      }
    )
  });

  it('should remove database', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.rm(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })     
  });

});
