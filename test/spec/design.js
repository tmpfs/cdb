var expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-design-doc-db'
  , design = 'mock-design-document';

describe('cdb:', function() {

  before(function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
          ddoc: design,
          body: require('../fixtures/design')
        }

    server.db.add(function(err) {
      if(err) {
        return done(err);
      }
      server.doc.add(opts, function(err) {
        done(err);
      });
    })     
  })

  after(function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.rm(function(err) {
      done(err);
    })     
  })

  it('should get design document info', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
    server.design.info({ddoc: design}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.name).to.be.a('string')
        .that.eqls(design);
      expect(body.view_index).to.be.an('object');
      done();
    })     
  });

  it('should list design documents', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
    server.design.ls(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.total_rows).to.be.a('number').that.is.gt(0);
      expect(body.rows).to.be.an('array')
        .to.have.length.gt(0);
      done();
    })     
  });

  it('should list design documents with opts', function(done) {
    var server = Server({server: process.env.COUCH, db: database})
    server.design.ls({qs: {}}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.total_rows).to.be.a('number').that.is.gt(0);
      expect(body.rows).to.be.an('array')
        .to.have.length.gt(0);
      done();
    })     
  });

});
