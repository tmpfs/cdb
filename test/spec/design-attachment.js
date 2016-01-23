var fs = require('fs')
  , expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-design-attachment-db'
  , docid = 'mock-design-attachment-document'
  , attname = 'mock-design-attachment'
  , prefix = '_design/';

describe('cdb:', function() {

  var revision;

  before(function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.add(function(err) {
      if(err) {
        return done(err);
      }
      var opts = {
        ddoc: docid,
        body: {}
      }
      server.doc.add(opts, function(err) {
        done(err);
      })     
    })     
  })

  after(function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.rm(function(err) {
      done(err);
    })     
  })

  it('should put attachment to design document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        ddoc: docid,
        attname: attname,
        file: fs.createReadStream('test/fixtures/mock.txt')
      }
    server.att.put(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.eql(prefix + docid);
      expect(body.rev).to.be.a('string');
      // stash to trigger specified revision code path
      revision = body.rev;
      done();
    })
  });

  it('should get attachment from design document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        ddoc: docid,
        attname: attname,
        file: 'target/mock.txt'
      }
    server.att.get(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.eql(undefined);
      var expected = '' + fs.readFileSync('test/fixtures/mock.txt');
      var received = '' + fs.readFileSync('target/mock.txt');
      expect(received).to.eql(expected);
      done();
    })
  });

  it('should head attachment from design document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        ddoc: docid,
        attname: attname
      }
    server.att.head(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.status).to.eql(200);
      expect(body.headers).to.be.an('object');
      expect(body.size).to.be.a('number');
      expect(body.name).to.be.a('string');
      expect(body.rev).to.be.a('string');
      done();
    })
  });

  it('should remove attachment from design document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        ddoc: docid,
        attname: attname
      }
    server.att.rm(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.eql(prefix + docid);
      expect(body.rev).to.be.a('string');
      done();
    })
  });

});
