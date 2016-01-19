var assert = require('assert');
var util = require('util');

var AbstractCouch = require('./abstract');
var types = require('./constants/types');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');

function Database(/*options*/) {
  AbstractCouch.apply(this, arguments);
}

util.inherits(Database, AbstractCouch);

/**
 *  Execute a temp view.
 */
Database.prototype.temp = function(opts, cb) {
  opts = this.merge(opts);
  assert(opts.body, 'body document is required');
  var u = this.url([opts.server, opts.db, keys.temp]);
  var req = {
    url: u,
    method: methods.post,
    body: opts.body
  };
  return this.request(req, opts, cb);
}

/**
 *  Insert/update multiple documents in bulk.
 */
Database.prototype.bulk = function(opts, cb) {
  opts = this.merge(opts);
  assert(opts.body, 'body document is required');
  var u = this.url([opts.server, opts.db, keys.bulk]);
  var req = {
    url: u,
    method: methods.post,
    body: opts.body
  };
  return this.request(req, opts, cb);
}

/**
 *  Purge documents.
 */
Database.prototype.purge = function(opts, cb) {
  opts = this.merge(opts);
  assert(opts.body, 'body document is required');
  var u = this.url([opts.server, opts.db, keys.purge]);
  var req = {
    url: u,
    method: methods.post,
    body: opts.body
  };
  return this.request(req, opts, cb);
}

/**
 *  Fetch missing revisions.
 */
Database.prototype.missingrevs = function(opts, cb) {
  opts = this.merge(opts);
  assert(opts.body, 'body document is required');
  var u = this.url([opts.server, opts.db, keys.missing]);
  var req = {
    url: u,
    method: methods.post,
    body: opts.body
  };
  return this.request(req, opts, cb);
}

/**
 *  Fetch missing revisions.
 */
Database.prototype.revsdiff = function(opts, cb) {
  opts = this.merge(opts);
  assert(opts.body, 'body document is required');
  var u = this.url([opts.server, opts.db, keys.diff]);
  var req = {
    url: u,
    method: methods.post,
    body: opts.body
  };
  return this.request(req, opts, cb);
}

/**
 *  Retrieve all documents for a database.
 */
Database.prototype.all = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.docs]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Retrieve database information.
 */
Database.prototype.info = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Check existence of a database.
 */
Database.prototype.head = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db]);
  var req = {url: u, method: methods.head};
  return this.request(req, opts, cb);
}

/**
 *  Create a database.
 */
Database.prototype.create = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db]);
  var req = {url: u, method: methods.put};
  return this.request(req, opts, cb);
}

/**
 *  Remove a database.
 */
Database.prototype.rm = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db]);
  var req = {url: u, method: methods.delete};
  return this.request(req, opts, cb);
}

/**
 *  Ensure full commit.
 */
Database.prototype.commit = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.commit]);
  var req = {
    url: u,
    method: methods.post,
    headers: {'content-type': types.json}
  };
  return this.request(req, opts, cb);
}

/**
 *  Compact a database and optionally a specific design document.
 */
Database.prototype.compact = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, opts.db, keys.compact];
  if(opts.ddoc) {
    parts.push(opts.ddoc);
  }
  var u = this.url(parts);
  var req = {
    url: u,
    headers: {'content-type': types.json},
    method: methods.post};
  return this.request(req, opts, cb);
}

/**
 *  Remove stale view indices.
 */
Database.prototype.cleanup = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.cleanup]);
  var req = {
    url: u,
    headers: {'content-type': types.json},
    method: methods.post};
  return this.request(req, opts, cb);
}

/**
 *  Get database changes.
 */
Database.prototype.changes = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.changes]);
  var req = {
    url: u,
    headers: {'content-type': types.json},
    method: methods.post};
  return this.request(req, opts, cb);
}

/**
 *  Get or set the database revisions limit.
 */
Database.prototype.limit = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.limit]);
  var limit = opts.limit;
  if(limit) {
    assert(typeof limit === 'number', 'limit must be a number');
  }
  var req = {
    url: u,
    method: limit ? methods.put : methods.get};
  if(limit) {
    req.body = this.stringify(limit);
  }
  return this.request(req, opts, cb);
}

// PRIVATE
Database.prototype.merge = function(opts) {
  opts = AbstractCouch.prototype.merge.call(this, opts);
  opts.db = opts.db || this.options.db;
  assert(opts.db, 'database name must be specified');
  return opts;
}

// ALIAS
Database.prototype.add = Database.prototype.create;

module.exports = Database;
