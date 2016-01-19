var util = require('util')
  , AbstractCouch = require('./abstract')
  , methods = require('./constants/methods')
  , keys = require('./constants/parameters');

function Config(/*options*/) {
  AbstractCouch.apply(this, arguments);
}

util.inherits(Config, AbstractCouch);

/**
 *  Get a configuration object.
 */
function get(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, keys.config];
  if(opts.section) {
    parts.push(opts.section);
  }
  if(opts.key) {
    parts.push(opts.key);
  }
  var u = this.url(parts);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Set a configuration value.
 */
function set(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, keys.config];
  if(opts.section) {
    parts.push(opts.section);
  }
  if(opts.key) {
    parts.push(opts.key);
  }
  var u = this.url(parts);
  var req = {
    url: u,
    method: methods.put,
    body: this.stringify(opts.value)};
  return this.request(req, opts, cb);
}

/**
 *  Remove a configuration key.
 */
function rm(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, keys.config];
  if(opts.section) {
    parts.push(opts.section);
  }
  if(opts.key) {
    parts.push(opts.key);
  }
  var u = this.url(parts);
  var req = {url: u, method: methods.delete};
  return this.request(req, opts, cb);
}

Config.prototype.get = get;
Config.prototype.set = set;
Config.prototype.rm = rm;

module.exports = Config;
