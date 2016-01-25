var expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-design-doc-db'
  , design = 'mock-design-document'
  , alt = 'mock-alt-design-document';

describe('cdb:', function() {

  before(function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
          ddoc: design,
          body: require('../fixtures/mock-design')
        }

    server.db.add(function(err) {
      if(err) {
        return done(err);
      }
      server.doc.add(opts, function(err) {
        if(err) {
          return done(err);
        }
        opts = {
          ddoc: alt,
          body: require('../fixtures/mock-alt-design')
        }
        server.doc.add(opts, function(err) {
          done(err);
        });
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

  it('should call design document show', function(done) {
    var server = Server()
      , opts = {
          server: process.env.COUCH,
          db: database,
          ddoc: design,
          name: 'mock'
        }
    server.design.show(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.error).to.eql('missing');
      expect(body.reason).to.eql('no document to show');
      done();
    })     
  });

  it('should call design document show with document id', function(done) {
    var server = Server()
      , opts = {
          server: process.env.COUCH,
          db: database,
          ddoc: design,
          name: 'mock',
          id: 'missing-document'
        }
    server.design.show(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.error).to.eql('missing');
      expect(body.reason).to.eql('no document to show');
      done();
    })     
  });

  it('should error on design document list without view', function(done) {
    var server = Server()
      , opts = {
          server: process.env.COUCH,
          db: database,
          ddoc: design,
          name: 'mock'
        }
    server.design.list(opts, function(err, res, body) {
      expect(err).to.be.instanceof(Error);
      expect(err.status).to.eql(404);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.error).to.eql('list_error');
      expect(body.reason).to.eql('Bad path.');
      done();
    })     
  });

  it('should call design document list', function(done) {
    var server = Server()
      , opts = {
          server: process.env.COUCH,
          db: database,
          ddoc: design,
          name: 'mock',
          view: 'mock'
        }
    server.design.list(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('array');
      done();
    })     
  });

  it('should call design document list (other design doc)', function(done) {
    var server = Server()
      , opts = {
          server: process.env.COUCH,
          db: database,
          ddoc: design,
          name: 'mock',
          view: 'alt',
          oddoc: alt
        }
    server.design.list(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('array');
      done();
    })     
  });

});
