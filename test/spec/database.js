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
      //expect(body.version).to.be.a('string');
      done();
    })     
  });

  it('should remove database', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.rm(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      //expect(body.version).to.be.a('string');
      done();
    })     
  });

});
