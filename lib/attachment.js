var assert = require('assert');
var etag = require('./util/etag');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');

/**
 *  Insert or update a document attachment.
 */
function put(opts, cb) {
  opts = this.merge(opts);
  assert(opts.id, 'document id required to put attachment')
  assert(opts.attname, 'attachment name required to put attachment');
  var u = this.url([opts.server, opts.db, opts.id, opts.attname]);
  var req = {
    url: u,
    method: methods.put
    //body: this.getRequestBody(opts.body)
  };
  return this.request(req, opts, cb);
}

/**
 *  Get a document attachment.
 */
function get(opts, cb) {
  opts = this.merge(opts);
  assert(opts.id, 'document id required to get attachment')
  assert(opts.attname, 'attachment name required to get attachment');
  var u = this.url([opts.server, opts.db, opts.id, opts.attname]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Remove a document attachment.
 *
 *  If rev is not specified a HEAD request is performed
 *  to fetch the latest revision.
 */
function rm(opts, cb) {
  var scope = this;
  opts = this.merge(opts);
  assert(opts.id, 'document id required to get attachment')
  assert(opts.attname, 'attachment name required to get attachment');
  var u = this.url([opts.server, opts.db, opts.id, opts.attname]);
  var req = {url: u, method: methods.delete};
  if(opts.qs && opts.qs.rev) {
    return this.request(req, opts, cb);
  }else{
    return head.call(this, opts, function(err, res, doc) {
      if(err) return cb(err, res);
      opts.qs = opts.qs || {};
      opts.qs.rev = doc.rev;
      return rm.call(scope, opts, cb);
    })
  }
}

/**
 *  Head a document attachment.
 */
function head(opts, cb) {
  opts = this.merge(opts);
  assert(opts.id, 'document id required to get attachment')
  assert(opts.attname, 'attachment name required to get attachment');
  var u = this.url([opts.server, opts.db, opts.id, opts.attname]);
  var req = {url: u, method: methods.head};
  return this.request(req, opts, function(err, res, doc) {
    if(err) return cb(err, res);
    var doc = {
      size: parseInt(res.headers['content-length']), rev: etag(res.headers)};
    cb(null, res, doc);
  });
}

module.exports = function Attachment(scope) {
  return {
    get: get.bind(scope),
    rm: rm.bind(scope),
    head: head.bind(scope),
    put: put.bind(scope)
  }
}
