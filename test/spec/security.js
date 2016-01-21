var expect = require('chai').expect
  , Server = require('../../index')
  , db = 'mock-security';

describe('cdb:', function() {
  var server = Server({server: process.env.COUCH, db: db});

  before(function(done) {
    server.db.create(function() {
      done();
    })  
  })

  after(function(done) {
    server.db.rm(function() {
      done();
    })  
  })

  it('should get security document', function(done) {
    server.security.get(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.eql({});
      done();
    })
  });

  it('should get security document with opts', function(done) {
    server.security.get({db: db}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.eql({});
      done();
    })
  });

  it('should set security document', function(done) {
    server.security.set({body: {}}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should set security document with string body', function(done) {
    server.security.set({body: '{}'}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

});
