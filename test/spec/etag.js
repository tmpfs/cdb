var expect = require('chai').expect
  , etag = require('../../lib/util/etag')

describe('cdb:', function() {

  it('should strip etag quotes', function(done) {
    var tag = etag('"f4fd"');
    expect(tag).to.eql('f4fd');
    done();
  });

  it('should strip etag quotes as object', function(done) {
    var tag = etag({etag: '"f4fd"'});
    expect(tag).to.eql('f4fd');
    done();
  });

  it('should use empty string on missing etag field', function(done) {
    var tag = etag({});
    expect(tag).to.eql('');
    done();
  });

});
