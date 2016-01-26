var expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-verb-db'
  , docid = 'mock-verb-document';

describe('cdb:', function() {
  var revision;

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

  it('should POST document', function(done) {
    var server = Server()
      , opts = {
        url: [process.env.COUCH, database].join('/'),
        headers: {
          'Referer': process.env.COUCH,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({_id: 'mock-post-document'})
      }
    server.post(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.be.a('string');
      expect(body.rev).to.be.a('string');
      done();
    })     
  });

  it('should PUT document', function(done) {
    var server = Server()
      , opts = {
        url: [process.env.COUCH, database, docid].join('/'),
        id: 'mock-document',
        body: {
          bool: true
        },
        headers: {
          'Referer': process.env.COUCH,
          'Content-Type': 'application/json'
        }
      }
    server.put(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.be.a('string');
      expect(body.rev).to.be.a('string');
      done();
    })     
  });

  it('should HEAD document', function(done) {
    var server = Server()
      , opts = {
        url: [process.env.COUCH, database, docid].join('/')
      }
    server.head(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body.status).to.eql(200);
      expect(body.headers).to.be.an('object');
      expect(body.size).to.be.a('number');
      expect(body.rev).to.be.a('string');
      revision = body.rev;
      done();
    })     
  });

  it('should HEAD missing document', function(done) {
    var server = Server()
      , opts = {
        url: [process.env.COUCH, database, 'missing-document'].join('/')
      }
    server.head(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.status).to.eql(404);
      done();
    })     
  });

  it('should GET document', function(done) {
    var server = Server()
      , opts = {
        url: [process.env.COUCH, database, docid].join('/')
      }
    server.get(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.bool).to.eql(true);
      done();
    })     
  });

  it('should COPY document', function(done) {
    var server = Server()
      , opts = {
        url: [process.env.COUCH, database, docid].join('/'),
        headers: {
          destination: 'mock-verb-document-copy'
        }
      }
    server.copy(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.eql(opts.headers.destination);
      expect(body.rev).to.be.a('string');
      done();
    })     
  });

  it('should DELETE document', function(done) {
    var server = Server()
      , opts = {
        url: [process.env.COUCH, database, docid].join('/'),
        qs: {
          rev: revision
        }
      }
    server.del(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.be.a('string');
      expect(body.rev).to.be.a('string');
      done();
    })     
  });

});
