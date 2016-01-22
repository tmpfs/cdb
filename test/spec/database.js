var expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-db';

describe('cdb:', function() {

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
