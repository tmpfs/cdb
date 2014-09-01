var assert = require('assert');
var util = require('util');
var DatabaseDocument = require('./document');
var etag = require('./util/etag');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');
var utils = require('./util');

var DesignDocument = function() {
  DatabaseDocument.apply(this, arguments);
}

util.inherits(DesignDocument, DatabaseDocument);

/**
 *  Prepend design document prefix.
 */
DesignDocument.prototype.prefix = function(id) {
  var design = keys.design + '/';
  if(id.indexOf(design) !== 0) {
    return design + id;
  }
  return id;
}

/**
 *  Get design document information.
 */
DesignDocument.prototype.info = function(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.design, opts.ddoc, keys.info]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Query a design document view.
 */
DesignDocument.prototype.view = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [
    opts.server,
    opts.db,
    keys.design,
    opts.ddoc,
    keys.view,
    opts.name
  ];
  var u = this.url(parts);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Get or post to an update handler.
 */
DesignDocument.prototype.update = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [
    opts.server,
    opts.db,
    keys.design,
    opts.ddoc,
    keys.update,
    opts.name
  ];
  if(opts.id) parts.push(opts.id);
  var u = this.url(parts);
  var req = opts.id
    ? {url: u, method: methods.put, body: opts.body} : {url: u, method: methods.post};
  return this.request(req, opts, cb);
}

/**
 *  Show a document.
 */
DesignDocument.prototype.show = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [
    opts.server,
    opts.db,
    keys.design,
    opts.ddoc,
    keys.show,
    opts.name
  ];
  if(opts.id) parts.push(opts.id);
  var u = this.url(parts);
  var req = {url: u, method: methods.post};
  return this.request(req, opts, cb);
}

/**
 *  Run a list function with a view.
 */
DesignDocument.prototype.list = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [
    opts.server,
    opts.db,
    keys.design,
    opts.ddoc,
    keys.list,
    opts.name
  ];
  if(opts.oddoc) parts.push(opts.oddoc);
  if(opts.view) parts.push(opts.view);
  var u = this.url(parts);
  var req = {url: u, method: methods.get};
  return this.request(req, opts, cb);
}

/**
 *  Execute against a rewrite rule.
 */
DesignDocument.prototype.rewrite = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [
    opts.server,
    opts.db,
    keys.design,
    opts.ddoc,
    keys.rewrite,
    opts.path
  ];
  var u = this.url(parts);
  var req = {url: u, method: opts.method || methods.get};
  return this.request(req, opts, cb);
}

/**
 *  List design documents.
 */
DesignDocument.prototype.ls = function(opts, cb) {
  opts = this.merge(opts);
  opts.qs = opts.qs || {};
  opts.qs.startkey = keys.design;
  opts.qs.endkey = keys.design + '0';
  opts.qs = utils.stringify(
    opts.qs, this.options.stringify);
  var u = this.url([opts.server, opts.db, keys.docs]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

module.exports = DesignDocument;
