var fs = require('fs')
  , expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-attachment-db'
  , docid = 'mock-attachment-document'
  , attname = 'mock-attachment';

describe('cdb:', function() {

  var revision;

  before(function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.add(function(err) {
      if(err) {
        return done(err);
      }
      var opts = {
        id: docid,
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

  it('should error on attempt to head missing document', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: 'missing-document',
        method: 'post',
        attname: attname,
        file: fs.createReadStream('test/fixtures/mock.txt')
      }
    // triggers error handling code path in revision() method
    server.att.put(opts, function(err) {
      expect(err).to.be.instanceof(Error);
      done();
    })
  });

  it('should error on missing file path', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: docid,
        attname: attname,
        progress: true,
        qs: {
          rev: revision
        },
        file: 'test/fixtures/missing-file.txt'
      }
    // triggers error handling code path for fs.stat()
    server.att.put(opts, function(err) {
      expect(err).to.be.instanceof(Error);
      done();
    })
  });

  it('should put attachment (stream)', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: docid,
        attname: attname,
        file: fs.createReadStream('test/fixtures/mock.txt')
      }
    server.att.put(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.eql(docid);
      expect(body.rev).to.be.a('string');
      // stash to trigger specified revision code path
      revision = body.rev;
      done();
    })
  });

  it('should put attachment (file path)', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: docid,
        attname: attname,
        progress: true,
        qs: {
          rev: revision
        },
        file: 'test/fixtures/mock.txt'
      }
    server.att.put(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.eql(docid);
      expect(body.rev).to.be.a('string');
      // stash to trigger specified revision code path
      revision = body.rev;
      done();
    })
  });

  it('should get attachment (file path)', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: docid,
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

  it('should get attachment (stream)', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: docid,
        attname: attname,
        file: fs.createWriteStream('target/mock.txt')
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

  it('should head attachment', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: docid,
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

  it('should remove attachment with revision', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: docid,
        attname: attname,
        qs: {
          rev: revision
        }
      }
    server.att.rm(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.eql(docid);
      expect(body.rev).to.be.a('string');
      done();
    })
  });

  it('should remove attachment', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
        id: docid,
        attname: attname
      }
    server.att.rm(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.id).to.eql(docid);
      expect(body.rev).to.be.a('string');
      done();
    })
  });

});
