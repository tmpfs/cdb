var assert = require('assert')
  , util = require('util')
  , AbstractCouch = require('./abstract')
  , types = require('./constants/types')
  , methods = require('./constants/methods')
  , keys = require('./constants/parameters');

function Database() {
  AbstractCouch.apply(this, arguments);
}

util.inherits(Database, AbstractCouch);

/**
 *  Execute a temp view.
 */
function temp(opts, cb) {
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
function bulk(opts, cb) {
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
function purge(opts, cb) {
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
function missingrevs(opts, cb) {
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
function revsdiff(opts, cb) {
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
function all(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.docs]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Retrieve database information.
 */
function info(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Check existence of a database.
 */
function head(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db]);
  var req = {url: u, method: methods.head};
  return this.request(req, opts, cb);
}

/**
 *  Create a database.
 */
function create(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db]);
  var req = {url: u, method: methods.put};
  return this.request(req, opts, cb);
}

/**
 *  Remove a database.
 */
function rm(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db]);
  var req = {url: u, method: methods.delete};
  return this.request(req, opts, cb);
}

/**
 *  Ensure full commit.
 */
function commit(opts, cb) {
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
function compact(opts, cb) {
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
function cleanup(opts, cb) {
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
function changes(opts, cb) {
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
function limit(opts, cb) {
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
function merge(opts) {
  opts = AbstractCouch.prototype.merge.call(this, opts);
  opts.db = opts.db || this.options.db;
  assert(opts.db, 'database name must be specified');
  return opts;
}

Database.prototype.temp = temp;
Database.prototype.bulk = bulk;
Database.prototype.purge = purge;
Database.prototype.missingrevs = missingrevs;
Database.prototype.revsdiff = revsdiff;
Database.prototype.all = all;
Database.prototype.info = info;
Database.prototype.head = head;
Database.prototype.create = create;
Database.prototype.rm = rm;
Database.prototype.commit = commit;
Database.prototype.compact = compact;
Database.prototype.cleanup = cleanup;
Database.prototype.changes = changes;
Database.prototype.limit = limit;

Database.prototype.merge = merge;

// ALIAS
Database.prototype.add = create;

module.exports = Database;
