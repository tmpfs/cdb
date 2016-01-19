var assert = require('assert');
var util = require('util');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');
var Database = require('./database');

function SecurityDocument() {
  Database.apply(this, arguments);
}

util.inherits(SecurityDocument, Database);

SecurityDocument.prototype.get = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.security]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

SecurityDocument.prototype.set = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.security]);
  assert(opts.body, 'body document required to set security object')
  if(typeof opts.body !== 'string') {
    opts.body = this.stringify(opts.body);
  }
  var req = {
    url: u,
    method: methods.put,
    body: opts.body
  };
  return this.request(req, opts, cb);
}

module.exports = SecurityDocument;
