var assert = require('assert');
var util = require('util');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');
var local = keys.local
  , design = keys.design;

var Database = require('./database');

var DatabaseDocument = function() {
  Database.apply(this, arguments);
}

util.inherits(DatabaseDocument, Database);

/**
 *  Insert or update a document.
 */
DatabaseDocument.prototype.save = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, opts.db, opts.ddoc || opts.id];
  if(opts.local && !opts.ddoc) parts.splice(2, 0, local);
  if(opts.ddoc) parts.splice(2, 0, design);
  var u = this.url(parts);
  assert(opts.body, 'body required to save document')
  var req = {
    url: u,
    method: methods.put,
    body: opts.body
  };
  return this.request(req, opts, cb);
}

/**
 *  Get a document from a database.
 */
DatabaseDocument.prototype.get = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, opts.db, opts.ddoc || opts.id];
  if(opts.local && !opts.ddoc) parts.splice(2, 0, local);
  if(opts.ddoc) parts.splice(2, 0, design);
  var u = this.url(parts);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Copy a document.
 */
DatabaseDocument.prototype.cp = function(opts, cb) {
  assert(opts.destination, 'destination is required to copy document');

  // relative destination URLs may only copy to other local documents
  if(opts.local && !opts.ddoc
    && !/^https?/.test(opts.destination)
    && opts.destination.indexOf(local) !== 0) {
    opts.destination = local + '/'
      + opts.destination.replace(/^\/+/, '');
  }else if(opts.ddoc
    && !/^https?/.test(opts.destination)
    && opts.destination.indexOf(design) !== 0) {
    opts.destination = design + '/'
      + opts.destination.replace(/^\/+/, '');
  }

  opts = this.merge(opts);
  var parts = [opts.server, opts.db, opts.ddoc || opts.id];
  if(opts.local && !opts.ddoc) parts.splice(2, 0, local);
  if(opts.ddoc) parts.splice(2, 0, design);

  var u = this.url(parts);
  //console.dir(u);
  var req = {url: u, method: methods.copy};
  req.headers = {destination: opts.destination};
  return this.request(req, opts, cb);
}

/**
 *  Remove a document from a database.
 *
 *  If rev is not specified a HEAD request is performed
 *  to fetch the latest revision.
 */
DatabaseDocument.prototype.rm = function(opts, cb) {
  var scope = this;
  opts = this.merge(opts);
  var parts = [opts.server, opts.db, opts.ddoc || opts.id];
  if(opts.local && !opts.ddoc) parts.splice(2, 0, local);
  if(opts.ddoc) parts.splice(2, 0, design);
  var u = this.url(parts);
  var req = {url: u, method: methods.delete};
  if(opts.qs && opts.qs.rev) {
    return this.request(req, opts, cb);
  }else{
    // cannot head local documents
    if(!opts.local) {
      return this.head.call(this, opts, function(err, res, doc) {
        if(err) return cb(err, res);
        opts.qs = opts.qs || {};
        opts.qs.rev = doc.rev;
        return scope.rm.call(scope, opts, cb);
      })
    // get document to determine revision for local
    }else{
      return this.get.call(this, opts, function(err, res, doc) {
        if(err) return cb(err, res);
        opts.qs = opts.qs || {};
        opts.qs.rev = doc._rev;
        return scope.rm.call(scope, opts, cb);
      })
    }
  }
}

/**
 *  Head a document.
 */
DatabaseDocument.prototype.head = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, opts.db, opts.ddoc || opts.id]
    , scope = this;
  if(opts.ddoc) parts.splice(2, 0, design);
  var u = this.url(parts);
  var req = {url: u, method: methods.head};
  return this.request(req, opts, function(err, res, doc) {
    var doc = scope.getHeadDocument(err, res, doc);
    cb(err, res, doc);
  });
}

DatabaseDocument.prototype.add = DatabaseDocument.prototype.save;

module.exports = DatabaseDocument;
