var assert = require('assert');
var fs = require('fs');
var etag = require('./util/etag');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');
var Readable = require('stream').Readable;

var Document = require('./document');

/**
 *  Insert or update a document attachment.
 */
function put(opts, cb) {
  var scope = this;
  opts = this.merge(opts);
  assert(opts.id, 'document id required to put attachment')
  assert(opts.attname, 'attachment name required to put attachment');

  var isStream = opts.file instanceof Readable;
  var fstats;

  function send() {
    var u = this.url([opts.server, opts.db, opts.id, opts.attname]);
    var req = {
      url: u,
      method: methods.put
    };
    var rs, conn = this.request(req, opts, function(err, res, doc) {
      if(!err && res && res.statusCode >= 200 && res.statusCode < 300) {
        conn.emit('upload/success', err, res, doc);
      }
      cb(err, res, doc);
    });
    if(isStream) {
      rs = opts.file;
    }else if(typeof opts.file === 'string') {
      rs = fs.createReadStream(opts.file);
    }
    if(fstats) {
      var uploaded = 0, total = fstats.size;
      function ondata(chunk) {
        uploaded += chunk.length;
        conn.emit('upload/progress',
          (uploaded / total), uploaded, total, chunk.length);
        if(uploaded === total) {
          rs.removeListener('data', ondata);
          conn.emit('upload/end');
        }
      }
      rs.on('data', ondata);
    }
    scope.emit('open', conn);
    rs.pipe(conn);
    return conn;
  }

  function revision() {
    // revision was specified
    if(opts.qs && opts.qs.rev) {
      return send.call(scope);
    // attempt to get latest revision
    }else{
      var doc = Document(this);
      return doc.head(opts, function onhead(err, res, doc) {
        if(err) return cb(err, res, doc);
        opts.qs = opts.qs || {};
        opts.qs.rev = doc.rev;
        return send.call(scope);
      })
    }
  }

  if(opts.progress && !isStream) {
    fs.stat(opts.file, function(err, stats) {
      if(err) return cb(err);
      fstats = stats;
      revision.call(scope);
    })
  }else{
    return revision.call(scope);
  }
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
