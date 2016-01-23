var expect = require('chai').expect
  , Server = require('../../index')

describe('cdb:', function() {

  it('should create server instance', function(done) {
    var server = Server({jar: {}, bitwise: true});
    expect(server).to.be.an('object');
    var database = server.use('mydb');
    expect(database.options.db).to.eql('mydb');
    done();
  });

});
