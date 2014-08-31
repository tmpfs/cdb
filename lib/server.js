var assert = require('assert');
var util = require('util');

var AbstractCouch = require('./abstract');
var CouchSession = require('./session');
var CouchConfig = require('./config');
var CouchDatabase = require('./database');

var types = require('./constants/types');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');
var feeds = require('./constants/feeds');

var Server = function(options) {
  AbstractCouch.apply(this, arguments);
  this.session = new CouchSession(options);
  this.config = new CouchConfig(options);
  this.db = new CouchDatabase(options);
  //console.log('options equal %s', this.options === this.db.options);
}

util.inherits(Server, AbstractCouch);

/**
 *  Replicate a database.
 */
Server.prototype.replicate = function(opts, cb) {
  opts = this.merge(opts);
  assert(opts.body, 'body document is required');
  var u = this.url([opts.server, keys.replicate]);
  var req = {
    url: u,
    method: methods.post,
    body: opts.body,
    headers: {referer: 'http://localhost:5984'}
  };
  return this.request(req, opts, cb);
}

/**
 *  Retrieve server information.
 */
Server.prototype.info = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, '']);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Get database updates.
 */
Server.prototype.updates = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.updates]);
  opts.qs = opts.qs || {};
  opts.qs.feed = opts.qs.feed || feeds.continuous;
  assert(~Object.keys(feeds).indexOf(opts.qs.feed),
    'unknown feed type ' + opts.qs.feed);
  var req = {url: u, method: methods.get};
  return this.request(req, opts, cb);
}

/**
 *  Restart a server.
 */
Server.prototype.restart = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.restart]);
  var req = {
    url: u,
    headers: {'content-type': types.json},
    method: methods.post};
  return this.request(req, opts, cb);
}

/**
 *  Retrieve server statistics.
 */
Server.prototype.stats = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.stats]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Retrieve list of uuids.
 */
Server.prototype.uuids = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.uuids]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  List databases.
 */
Server.prototype.ls = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.dbs]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Retrieve active tasks.
 */
Server.prototype.tasks = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.tasks]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Retrieve server log tail.
 */
Server.prototype.tail = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.log]);
  var req = {url: u, headers: {accept: types.text}};
  return this.request(req, opts, cb);
}

/**
 *  Use a particular database.
 */
Server.prototype.use = function(name) {
  var opts = {};
  for(var z in this.options){opts[z] = this.options[z]};
  opts.db = name;
  return new CouchDatabase(opts);
}

module.exports = Server;
