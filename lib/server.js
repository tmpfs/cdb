var assert = require('assert')
  , util = require('util')
  , AbstractCouch = require('./abstract')
  , CouchSession = require('./session')
  , CouchConfig = require('./config')
  , CouchDatabase = require('./database')
  , DatabaseDocument = require('./document')
  , Attachment = require('./attachment')
  , SecurityDocument = require('./security')
  , DesignDocument = require('./design')
  , types = require('./constants/types')
  , methods = require('./constants/methods')
  , keys = require('./constants/parameters')
  , feeds = require('./constants/feeds');

function Server(options) {
  if(!(this instanceof Server)) {
    return new Server(options); 
  }
  AbstractCouch.apply(this, arguments);
  this.session = new CouchSession(options, this);
  this.config = new CouchConfig(options, this);
  this.db = new CouchDatabase(options, this);
  this.doc = new DatabaseDocument(options, this);
  this.att = new Attachment(options, this);
  this.sec = new SecurityDocument(options, this);
  this.design = new DesignDocument(options, this);
  // alias with full name - `sec` is deprecated
  this.security = this.sec;
}

util.inherits(Server, AbstractCouch);

/**
 *  Replicate a database.
 */
function replicate(opts, cb) {
  opts = this.merge(opts);
  assert(opts.body, 'body document is required');
  var u = this.url([opts.server, keys.replicate]);
  var req = {
    url: u,
    method: methods.post,
    body: opts.body
  };
  return this.request(req, opts, cb);
}

/**
 *  Retrieve server information.
 */
function info(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = this.merge(opts);
  var u = this.url([opts.server, '']);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Get database updates.
 */
function updates(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.updates]);
  opts.qs = opts.qs || {};
  opts.qs.feed = opts.qs.feed || feeds.longpoll;
  assert(~Object.keys(feeds).indexOf(opts.qs.feed),
    'unknown feed type ' + opts.qs.feed);
  var req = {url: u, method: methods.get};
  return this.request(req, opts, cb);
}

/**
 *  Restart a server.
 */
function restart(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
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
function stats(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.stats]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Retrieve list of uuids.
 */
function uuids(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.uuids]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  List databases.
 */
function ls(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = this.merge(opts);
  //console.dir(opts);
  var u = this.url([opts.server, keys.dbs]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Retrieve active tasks.
 */
function tasks(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.tasks]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Retrieve server log tail.
 */
function tail(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = this.merge(opts);
  var u = this.url([opts.server, keys.log]);
  var req = {url: u, headers: {accept: types.text}};
  return this.request(req, opts, cb);
}

/**
 *  Use a particular database.
 */
function use(name) {
  var opts = {};
  for(var z in this.options){
    opts[z] = this.options[z]
  }
  opts.db = name;
  return new CouchDatabase(opts);
}

Server.prototype.replicate = replicate;
Server.prototype.info = info;
Server.prototype.ls = ls;
Server.prototype.tasks = tasks;
Server.prototype.updates = updates;
Server.prototype.restart = restart;
Server.prototype.stats = stats;
Server.prototype.uuids = uuids;
Server.prototype.tail = tail;
Server.prototype.use = use;

// static exports
var constants
  , k;
Server.util = require('./util');
Server.schema = require('./schema');
Server.log = {
  levels: require('./constants/levels')
}
Server.CouchError = require('./error');

// constants shortcuts
constants = require('./constants');
for(k in constants) {
  Server[k] = constants[k];
}
Server.user = {
  prefix: 'org.couchdb.user:',
  db: Server.defaults.users
}
Server.replicator = Server.defaults.replicator;
Server.users = Server.defaults.users;

Server.config = require('./constants/config');
Server.sections = {};
Server.sections.map = {};
for(k in Server.config) {
  Server.sections[k] = k;
  Server.sections.map[k] = Server.config[k].keys;
}

module.exports = Server;
