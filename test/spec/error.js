var expect = require('chai').expect
  , CouchError = require('../../lib/error');

describe('cdb:', function() {

  it('should create error instance with reason', function(done) {
    var err = new CouchError({reason: 'err_reason'});
    expect(err).to.be.instanceof(CouchError);
    expect(err.status).to.eql(500);
    expect(err.reason).to.eql('err_reason');
    done();
  });

});
