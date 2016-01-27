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
      done(err);
    })
  })

  after(function(done) {
    var opts = {section: Server.sections.admins, key: username};
    opts.headers = headers;
    server.config.rm(opts, function(err) {
      done(err);
    })
  })

  it('should get 401 error on HEAD _config', function(done) {
    var opts = {url: [process.env.COUCH, '_config'].join('/')};
    server.head(opts, function(err, res, body) {
      expect(err).to.be.an.instanceof(Error);
      expect(err.status).to.eql(401);
      expect(res).to.be.an('object');
      expect(body).to.eql(undefined);
      done();
    })
  });

});
