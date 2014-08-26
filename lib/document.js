var assert = require('assert');
var etag = require('./util/etag');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');
var local = keys.local;

/**
 *  Insert or update a document.
 */
function save(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, opts.db, opts.id];
  if(opts.local) parts.splice(2, 0, local);
  var u = this.url(parts);
  assert(opts.body, 'body required to save document')
  var req = {
    url: u,
    method: methods.put,
    body: this.getRequestBody(opts.body)
  };
  return this.request(req, opts, cb);
}

/**
 *  Get a document from a database.
 */
function get(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, opts.db, opts.id];
  if(opts.local) parts.splice(2, 0, local);
  var u = this.url(parts);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Copy a document.
 */
function cp(opts, cb) {
  assert(opts.destination, 'destination is required to copy document');
  opts = this.merge(opts);
  var parts = [opts.server, opts.db, opts.id];
  if(opts.local) parts.splice(2, 0, local);
  var u = this.url(parts);
  var req = {url: u, method: methods.COPY};
  req.headers = {destination: opts.destination};
  return this.request(req, opts, cb);
}

/**
 *  Remove a document from a database.
 *
 *  If rev is not specified a HEAD request is performed
 *  to fetch the latest revision.
 */
function rm(opts, cb) {
  var scope = this;
  opts = this.merge(opts);
  var parts = [opts.server, opts.db, opts.id];
  if(opts.local) parts.splice(2, 0, local);
  var u = this.url(parts);
  var req = {url: u, method: methods.delete};
  if(opts.qs && opts.qs.rev) {
    return this.request(req, opts, cb);
  }else{
    // cannot head local documents
    if(!opts.local) {
      return head.call(this, opts, function(err, res, doc) {
        if(err) return cb(err, res);
        opts.qs = opts.qs || {};
        opts.qs.rev = doc.rev;
        return rm.call(scope, opts, cb);
      })
    // get document to determine revision for local
    }else{
      return get.call(this, opts, function(err, res, doc) {
        if(err) return cb(err, res);
        opts.qs = opts.qs || {};
        opts.qs.rev = doc._rev;
        return rm.call(scope, opts, cb);
      })
    }
  }
}

/**
 *  Head a document.
 */
function head(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, opts.id]);
  var req = {url: u, method: methods.head};
  return this.request(req, opts, function(err, res, doc) {
    if(err) return cb(err, res);
    var doc = {
      size: parseInt(res.headers['content-length']),
      rev: etag(res.headers)
    }
    cb(null, res, doc);
  });
}

module.exports = function Document(scope) {
  return {
    get: get.bind(scope),
    rm: rm.bind(scope),
    head: head.bind(scope),
    save: save.bind(scope)
  }
}
