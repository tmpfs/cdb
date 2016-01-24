var expect = require('chai').expect
  , Server = require('../../index')
  , database = 'mock-design-doc-db'
  , design = 'mock-design-document';

describe('cdb:', function() {

  before(function(done) {
    var server = Server({server: process.env.COUCH, db: database})
      , opts = {
          ddoc: design,
          body: {}      
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

});
