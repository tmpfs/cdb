var expect = require('chai').expect
  , url = require('../../lib/util/url')

describe('cdb:', function() {

  it('should return empty string on no array parts', function(done) {
    var u = url.join([]);
    expect(u).to.eql('');
    done();
  });

  it('should join url string from array parts', function(done) {
    var u = url.join(['foo', 'bar']);
    expect(u).to.eql('foo/bar');
    done();
  });

  it('should parse server key', function(done) {
    var key = url.key('http://localhost:5984/db');
    expect(key).to.eql('http://localhost:5984');
    done();
  });

});
