var assert = require('assert');
var util = require('util');

var AbstractCouch = require('./abstract');
var Document = require('./document');
var types = require('./constants/types');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');

var Database = function(options) {
  AbstractCouch.apply(this, arguments);
  this.doc = Document(this);
}

util.inherits(Database, AbstractCouch);

/**
 *  Execute a temp view.
 */
Database.prototype.temp = function(opts, cb) {
  opts = this.merge(opts, cb);
  assert(typeof opts.body === 'string', 'temp view body must be string');
  var u = this.url([opts.server, opts.db, keys.temp]);
  var req = {
    url: u,
    method: methods.post,
    body: opts.body,
    headers: {accept: types.json, 'content-type': types.json}
  };
  return this.request(req, opts, opts.cb);
}

/**
 *  Retrieve all documents for a database.
 */
Database.prototype.all = function(opts, cb) {
  opts = this.merge(opts, cb);
  var u = this.url([opts.server, opts.db, keys.docs]);
  var req = {
    url: u,
    headers: {accept: types.json, 'content-type': types.json}
  };
  return this.request(req, opts, opts.cb);
}

/**
 *  Retrieve database information.
 */
Database.prototype.info = function(opts, cb) {
  opts = this.merge(opts, cb);
  var u = this.url([opts.server, opts.db]);
  var req = {
    url: u,
    headers: {accept: types.json, 'content-type': types.json}};
  return this.request(req, opts, opts.cb);
}

/**
 *  Check existence of a database.
 */
Database.prototype.exists = function(opts, cb) {
  opts = this.merge(opts, cb);
  var u = this.url([opts.server, opts.db]);
  var req = {
    url: u,
    headers: {accept: types.json, 'content-type': types.json},
    method: methods.head};
  return this.request(req, opts, opts.cb);
}

/**
 *  Create a database.
 */
Database.prototype.create = function(opts, cb) {
  opts = this.merge(opts, cb);
  var u = this.url([opts.server, opts.db]);
  var req = {
    url: u,
    headers: {accept: types.json, 'content-type': types.json},
    method: methods.put};
  return this.request(req, opts, opts.cb);
}

/**
 *  Remove a database.
 */
Database.prototype.rm = function(opts, cb) {
  opts = this.merge(opts, cb);
  var u = this.url([opts.server, opts.db]);
  var req = {
    url: u,
    headers: {accept: types.json, 'content-type': types.json},
    method: methods.delete};
  return this.request(req, opts, opts.cb);
}

/**
 *  Ensure full commit.
 */
Database.prototype.commit = function(opts, cb) {
  opts = this.merge(opts, cb);
  var u = this.url([opts.server, opts.db, keys.commit]);
  var req = {
    url: u,
    headers: {accept: types.json, 'content-type': types.json},
    method: methods.post};
  return this.request(req, opts, opts.cb);
}

/**
 *  Compact a database and optionally a specific design document.
 */
Database.prototype.compact = function(opts, cb) {
  opts = this.merge(opts, cb);
  var parts = [opts.server, opts.db, keys.compact];
  if(opts.ddoc) parts.push(opts.ddoc);
  var u = this.url(parts);
  var req = {
    url: u,
    headers: {accept: types.json, 'content-type': types.json},
    method: methods.post};
  return this.request(req, opts, opts.cb);
}

/**
 *  Remove stale view indices.
 */
Database.prototype.cleanup = function(opts, cb) {
  opts = this.merge(opts, cb);
  var u = this.url([opts.server, opts.db, keys.cleanup]);
  var req = {
    url: u,
    headers: {accept: types.json, 'content-type': types.json},
    method: methods.post};
  return this.request(req, opts, opts.cb);
}

/**
 *  Get database changes.
 */
Database.prototype.changes = function(opts, cb) {
  opts = this.merge(opts, cb);
  var u = this.url([opts.server, opts.db, keys.changes]);
  var req = {
    url: u,
    headers: {accept: types.json, 'content-type': types.json},
    method: methods.post};
  return this.request(req, opts, opts.cb);
}

/**
 *  Get or set the database revisions limit.
 */
Database.prototype.limit = function(opts, cb) {
  opts = this.merge(opts, cb);
  var u = this.url([opts.server, opts.db, keys.limit]);
  var limit = opts.limit;
  if(limit) {
    assert(typeof limit === 'number', 'limit must be a number');
  }
  var req = {
    url: u,
    headers: {accept: types.json, 'content-type': types.json},
    method: limit ? methods.put : methods.get};
  if(limit) req.body = JSON.stringify(limit);
  return this.request(req, opts, opts.cb);
}

Database.prototype.security = function() {
  var o = {};
  o.get = function getsec(opts, cb) {
    opts = this.merge(opts, cb);
    //console.log('security get %j', opts);
    var u = this.url([opts.server, opts.db, keys.security]);
    var req = {
      url: u,
      headers: {accept: types.json, 'content-type': types.json}};
    return this.request(req, opts, opts.cb);
  }.bind(this);
  o.set = function setsec(opts, cb) {
    opts = this.merge(opts, cb);
    var u = this.url([opts.server, opts.db, keys.security]);
    assert(opts.body, 'body document required to set security object')
    if(typeof opts.body !== 'string') {
      opts.body = JSON.stringify(opts.body);
    }
    var req = {
      url: u,
      headers: {accept: types.json, 'content-type': types.json},
      method: methods.put,
      body: opts.body
    };
    return this.request(req, opts, opts.cb);
  }.bind(this);
  return o;
}

// PRIVATE
Database.prototype.merge = function(opts, cb) {
  var res = AbstractCouch.prototype.merge.apply(this, arguments);
  res.db = opts.db || this.options.db;
  assert(res.db, 'database name must be specified');
  return res;
}

// ALIAS
Database.prototype.head = Database.prototype.exists;
Database.prototype.add = Database.prototype.create;

module.exports = Database;
