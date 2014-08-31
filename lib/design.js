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
