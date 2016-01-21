var assert = require('assert')
  , util = require('util')
  , methods = require('./constants/methods')
  , keys = require('./constants/parameters')
  , Database = require('./database');

function SecurityDocument() {
  Database.apply(this, arguments);
}

util.inherits(SecurityDocument, Database);

function get(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null; 
  }
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
    opts.body = this.stringify(opts.body);
  }
  var req = {
    url: u,
    method: methods.put,
    body: opts.body
  };
  return this.request(req, opts, cb);
}

SecurityDocument.prototype.get = get;
SecurityDocument.prototype.set = set;

module.exports = SecurityDocument;
