var expect = require('chai').expect
  , Server = require('../../index')
  , CouchError = require('../../lib/error')
  , database = 'mock-db';

describe('cdb:', function() {

  it('should head database (404)', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.head(function(err, res, body) {
      expect(err).to.be.an('object');
      expect(err).to.be.instanceof(CouchError)
      expect(err.status).to.eql(404);
      expect(err.reason).to.eql('not_found');
      expect(err.getErrorKey()).to.eql('ENOT_FOUND');
      expect(res).to.be.an('object');
      expect(body).to.eql('');
      done();
    })     
  });

  it('should create database', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.add(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })     
  });

  it('should head database', function(done) {
    var server = Server();
    server.db.head({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.eql('');
        done();
      }
    )     
  });

  it('should get database info', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.info(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.db_name).to.eql(database);
      done();
    })
  });

  it('should get database info with opts', function(done) {
    var server = Server();
    server.db.info({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.db_name).to.eql(database);
        done();
      }
    )
  });

  it('should get all docs', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.all(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.total_rows).to.be.a('number');
      expect(body.offset).to.be.a('number');
      expect(body.rows).to.be.an('array');
      done();
    })
  });

  it('should get all docs with opts', function(done) {
    var server = Server();
    server.db.all({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.total_rows).to.be.a('number');
        expect(body.offset).to.be.a('number');
        expect(body.rows).to.be.an('array');
        done();
      }
    )
  });

  it('should get database changes', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.changes(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.results).to.be.an('array');
      expect(body.last_seq).to.be.a('number');
      done();
    })
  });

  it('should get database changes with opts', function(done) {
    var server = Server();
    server.db.changes({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.results).to.be.an('array');
        expect(body.last_seq).to.be.a('number');
        done();
      }
    )
  });

  it('should cleanup database', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.cleanup(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should cleanup database with opts', function(done) {
    var server = Server();
    server.db.cleanup({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.ok).to.eql(true);
        done();
      }
    )
  });

  it('should commit database', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.commit(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should commit database with opts', function(done) {
    var server = Server();
    server.db.commit({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.ok).to.eql(true);
        done();
      }
    )
  });

  it('should compact database', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.compact(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should compact database with opts', function(done) {
    var server = Server();
    server.db.compact({server: process.env.COUCH, db: database},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.ok).to.eql(true);
        done();
      }
    )
  });

  it('should get database revs limit', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.limit(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.a('number');
      done();
    })
  });

  it('should set database revs limit', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.limit({limit: 10},
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.ok).to.eql(true);
        done();
      }
    )
  });

  it('should purge db doc', function(done) {
    var server = Server();
    var opts = {
      server: process.env.COUCH,
      db: database,
      body: {'missing-id': []}
    };
    server.db.purge(opts,
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.purge_seq).to.be.a('number');
        expect(body.purged).to.be.an('object');
        done();
      }
    )
  });

  it('should get missing revs', function(done) {
    var server = Server();
    var opts = {
      server: process.env.COUCH,
      db: database,
      body: {'missing-id': []}
    };
    server.db.missingrevs(opts,
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.missing_revs).to.be.an('object');
        expect(body.missing_revs['missing-id']).to.be.an('array');
        done();
      }
    )
  });

  it('should execute temp view', function(done) {
    var server = Server();
    var opts = {
      server: process.env.COUCH,
      db: database,
      body: {
        map: 'function(doc) {emit(null, doc)}'
      },
      qs: {
        limit: 11
      }
    };
    server.db.temp(opts,
      function(err, res, body) {
        expect(err).to.eql(null);
        expect(res).to.be.an('object');
        expect(body).to.be.an('object');
        expect(body.rows).to.be.an('array');
        done();
      }
    )
  });

  it('should remove database', function(done) {
    var server = Server({server: process.env.COUCH, db: database});
    server.db.rm(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })     
  });

});
