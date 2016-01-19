var expect = require('chai').expect
  , stringify = require('../../lib/util/stringify')

describe('cdb:', function() {

  it('should stringify with default serializer', function(done) {
    var obj = stringify({startkey: 'my value', foo: 'bar'});
    expect(obj).to.eql({"startkey": "\"my value\"", "foo": "bar"});
    done();
  });

});
