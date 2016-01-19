var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should set server config', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {section: Server.sections.admins, key: 'foo', value: 'bar'};
    server.config.set(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.eql('');
      done();
    })
  });

  it('should get server config', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {section: Server.sections.cors, key: 'credentials'};

    opts.headers = {
      'Authorization': 'Basic ' + new Buffer('foo:bar').toString('base64')};

    server.config.get(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.a('string');
      done();
    })
  });

  it('should remove server config', function(done) {
    var server = Server({server: process.env.COUCH})
      , opts = {section: Server.sections.admins, key: 'foo'};

    opts.headers = {
      'Authorization': 'Basic ' + new Buffer('foo:bar').toString('base64')};

    server.config.rm(opts, function(err, res, body) {
      expect(err).to.eql(null);
      expect(res).to.be.an('object');
      expect(body).to.be.a('string');
      done();
    })
  });

});
