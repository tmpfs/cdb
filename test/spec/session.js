var expect = require('chai').expect
  , Server = require('../../index')
  , username = 'foo'
  , password = 'bar'
  , headers = {
      'Authorization': 'Basic '
        + new Buffer(username + ':' + password).toString('base64')};

describe('cdb:', function() {

  before(function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {
          section: Server.sections.admins,
          key: username,
          value: password
        };
    server.config.set(opts, function(err) {
      done(err);
    })
  })

  after(function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {section: Server.sections.admins, key: username};
    opts.headers = headers;
    server.config.rm(opts, function(err) {
      done(err);
    })
  })

  it('should get session document', function(done) {
    var server = Server({server: process.env.COUCH});
    server.session.get(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should get session document with opts', function(done) {
    var server = Server();
    server.session.get({server: process.env.COUCH}, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      done();
    })
  });

  it('should set session document (login)', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {username: username, password: password};
    server.session.set(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      expect(body.ok).to.eql(true);
      expect(body.roles).to.be.an('array');
      expect(server.jar).to.be.an('object');
      expect(server.jar.cookie).to.be.an('object');
      expect(server.jar.cookie[process.env.COUCH]).to.be.an('object');
      expect(server.jar.cookie[process.env.COUCH].user)
        .to.be.a('string').that.eqls(username);
      expect(server.jar.cookie[process.env.COUCH].list)
        .to.be.an('object');
      expect(server.jar.cookie[process.env.COUCH].list[username])
        .to.be.a('string');
      done();
    })
  });

});
