var expect = require('chai').expect
  , Server = require('../../index')
  , username = 'foo'
  , password = 'bar'
  , headers = {
      'Authorization': 'Basic '
        + new Buffer(username + ':' + password).toString('base64')};

describe('cdb:', function() {

  it('should set server config', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {
          section: Server.sections.admins,
          key: username,
          value: password
        };
    server.config.set(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.eql('');
      done();
    })
  });

  it('should listen for 401 on unauth config', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {};

    server.on('401', function(err, res, body, cb) {
      expect(err).to.be.an.instanceof(Error);
      expect(err.status).to.eql(401);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.error).to.eql('unauthorized');
      expect(cb).to.be.a('function');
      expect(cb.name).to.eql('onUnauthConfig');
      done();
    })

    server.config.get(opts, function onUnauthConfig() {});
  });

  it('should get entire server config', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {};
    opts.headers = headers;
    server.config.get(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      done();
    })
  });

  it('should get server config (section)', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {section: Server.sections.cors};
    opts.headers = headers;
    server.config.get(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      done();
    })
  });

  it('should get server config (key)', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {section: Server.sections.cors, key: 'credentials'};
    opts.headers = headers;
    server.config.get(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.a('string');
      done();
    })
  });

  it('should error without section (set)', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {key: 'mock-key'};
    opts.headers = headers;
    server.config.set(opts, function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(/section option is required/i)
      done();
    })
  });

  it('should error without key (set)', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {section: 'mock-section'};
    opts.headers = headers;
    server.config.set(opts, function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(/key option is required/i)
      done();
    })
  });

  it('should error without section (rm)', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {key: 'mock-key'};
    opts.headers = headers;
    server.config.rm(opts, function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(/section option is required/i)
      done();
    })
  });

  it('should error without key (rm)', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {section: 'mock-section'};
    opts.headers = headers;
    server.config.rm(opts, function(err) {
      function fn() {
        throw err;
      }
      expect(fn).throws(/key option is required/i)
      done();
    })
  });

  it('should remove server config', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {section: Server.sections.admins, key: username};
    opts.headers = headers;
    server.config.rm(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.a('string');
      done();
    })
  });

});
