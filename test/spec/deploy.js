var expect = require('chai').expect
  , Server = require('../../index')
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

});
