var util = require('util');

var AbstractCouch = require('./abstract');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');

var Config = function(options) {
  AbstractCouch.apply(this, arguments);
}

util.inherits(Config, AbstractCouch);

/**
 *  Get a configuration object.
 */
Config.prototype.get = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, keys.config];
  if(opts.section) parts.push(opts.section);
  if(opts.key) parts.push(opts.key);
  var u = this.url(parts);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Set a configuration value.
 */
Config.prototype.set = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, keys.config];
  if(opts.section) parts.push(opts.section);
  if(opts.key) parts.push(opts.key);
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
Config.prototype.rm = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, keys.config];
  if(opts.section) parts.push(opts.section);
  if(opts.key) parts.push(opts.key);
  var u = this.url(parts);
  var req = {url: u, method: methods.delete};
  return this.request(req, opts, cb);
}

module.exports = Config;
