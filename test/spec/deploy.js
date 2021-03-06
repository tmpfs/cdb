var expect = require('chai').expect
  , Server = require('../../index')
  , uuid = require('uuid')
  , database = 'mock-design-deploy-db'
  , design = 'mock-design-document';

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

  it('should deploy design document', function(done) {
    var server = Server()
      , opts = {
          server: process.env.COUCH,
          db: database,
          ddoc: design,
          body: require('../fixtures/mock-design')
        }
    server.design.deploy(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should deploy design document with uuid opt', function(done) {
    var server = Server()
      , opts = {
          server: process.env.COUCH,
          db: database,
          ddoc: design,
          body: require('../fixtures/mock-design'),
          uuid: uuid
        }
    server.design.deploy(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should deploy missing design document', function(done) {
    var server = Server()
      , ddoc = design + '-missing'
      , opts = {
          server: process.env.COUCH,
          db: database,
          ddoc: ddoc,
          body: require('../fixtures/mock-design')
        }
    server.design.deploy(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.summary.ddoc).to.eql(ddoc);
      done();
    })
  });

  it('should callback with no design document views', function(done) {
    var server = Server()
      , opts = {
          server: process.env.COUCH,
          db: database,
          ddoc: design,
          body: {}
        }
    server.design.deploy(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should callback with empty design document views', function(done) {
    var server = Server()
      , opts = {
          server: process.env.COUCH,
          db: database,
          ddoc: design,
          body: {views:{}}
        }
    server.design.deploy(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.eql(null);
      expect(body.ok).to.eql(true);
      done();
    })
  });

});
