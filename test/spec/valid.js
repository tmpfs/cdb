var expect = require('chai').expect
  , valid = require('../../lib/util/valid')

describe('cdb:', function() {

  it('should return false on invalid db name', function(done) {
    var isValid = valid('!foo');
    expect(isValid).to.eql(false);
    done();
  });

  it('should return true on reserved db name', function(done) {
    var isValid = valid('_users');
    expect(isValid).to.eql(true);
    done();
  });

});
