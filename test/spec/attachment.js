var fs = require('fs')
  , expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-attachment-db'
  , docid = 'mock-attachment-document'
  , attname = 'mock-attachment';

describe('cdb:', function() {

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

});
