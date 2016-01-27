var expect = require('chai').expect
  , Server = require('../../index')
  , username = 'foo'
  , password = 'bar'
  , headers = {
      'Authorization': 'Basic '
        + new Buffer(username + ':' + password).toString('base64')};

describe('cdb:', function() {
  var server = Server({server: process.env.COUCH});

  before(function(done) {
    var opts = {
        section: Server.sections.admins,
        key: username,
        value: password
      };
    server.config.set(opts, function(err) {
      if(err) {
        return done(err);
      }
      opts = {username: username, password: password};
      server.session.set(opts, function(err) {
        done(err);
      });
    })
  })

  after(function(done) {
    var opts = {section: Server.sections.admins, key: username};
    opts.headers = headers;
    server.config.rm(opts, function(err) {
      done(err);
    })
  })

  it('should get server info as authenticated user', function(done) {
    server.info(function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.an('object');
      done();
    })
  });

});
