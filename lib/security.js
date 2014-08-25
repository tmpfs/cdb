var assert = require('assert');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');

function get(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.security]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

function set(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.security]);
  assert(opts.body, 'body document required to set security object')
  if(typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
  }
  var req = {
    url: u,
    method: methods.put,
    body: opts.body
  };
  return this.request(req, opts, cb);
}

module.exports = function SecurityDocument(scope) {
  return {
    get: get.bind(scope),
    set: set.bind(scope),
  }
}
