var assert = require('assert')
  , util = require('util')
  , fs = require('fs')
  , methods = require('./constants/methods')
  , keys = require('./constants/parameters')
  , design = keys.design
  , Readable = require('stream').Readable
  , Writable = require('stream').Writable;

var DatabaseDocument = require('./document');

function revision(opts, cb) {
  var scope = this;
  // revision was specified
  if(opts.qs && opts.qs.rev) {
    return cb.call(scope);
  // attempt to get latest revision
  }else{
    return DatabaseDocument.prototype.head.call(scope, opts,
      function onhead(err, res, doc) {
        if(err) {
          return cb.call(scope, err, res, doc);
        }
        opts.qs = opts.qs || {};
        opts.qs.rev = doc.rev;
        return cb.call(scope);
      }
    )
  }
}

function Attachment() {
  DatabaseDocument.apply(this, arguments);
}

util.inherits(Attachment, DatabaseDocument);

/**
 *  Insert or update a document attachment (upload).
 */
function put(opts, cb) {
  var scope = this;
  opts = this.merge(opts);
  assert(opts.ddoc || opts.id, 'document id required to put attachment')
  assert(opts.attname, 'attachment name required to put attachment');

  var isStream = opts.file instanceof Readable;
  var fstats;

  function send() {
    var parts = [opts.server, opts.db, opts.ddoc || opts.id, opts.attname];
    if(opts.ddoc) {
      parts.splice(2, 0, design);
    }
    var u = this.url(parts);
    var req = {
      url: u,
      method: methods.put
    };
    var rs, conn = this.request(req, opts, function(err, res, doc) {
      cb(err, res, doc);
    });

    function onData(chunk) {
      uploaded += chunk.length;
      conn.emit('progress',
        (uploaded / total), uploaded, total, chunk.length);
      if(uploaded === total) {
        rs.removeListener('data', onData);
      }
    }

    if(isStream) {
      rs = opts.file;
    }else if(typeof opts.file === 'string') {
      rs = fs.createReadStream(opts.file);
    }
    if(fstats) {
      var uploaded = 0, total = fstats.size;
      rs.on('data', onData);
    }
    scope.emit('open', conn, fstats);
    rs.pipe(conn);
    return conn;
  }

  if(opts.progress && !isStream) {
    fs.stat(opts.file, function(err, stats) {
      if(err) {
        return cb(err);
      }
      fstats = stats;
      revision.call(scope, opts, send);
    })
  }else{
    return revision.call(scope, opts, send);
  }
}

/**
 *  Get a document attachment (download).
 */
function get(opts, cb) {
  var scope = this;
  opts = this.merge(opts);
  assert(opts.ddoc || opts.id, 'document id required to get attachment')
  assert(opts.attname, 'attachment name required to get attachment');
  assert(opts.file, 'output file is required to get attachment');
  var parts = [opts.server, opts.db, opts.ddoc || opts.id, opts.attname];
  if(opts.ddoc) {
    parts.splice(2, 0, design);
  }
  var u = this.url(parts);
  var isStream = opts.file instanceof Writable;

  function fetch() {
    var req = {url: u}, ws;
    req.raw = true;
    if(isStream) {
      ws = opts.file;
    }else if(typeof opts.file === 'string') {
      ws = fs.createWriteStream(opts.file);
    }
    req.stream = ws;
    var conn = scope.request(req, opts, function(err, res, doc) {
      //console.log('att/get err %s', err.message);
      //console.log('att/get doc %j', doc);
      cb(err, res, doc);
    });

    conn.on('response', function(res) {

      function onData(chunk) {
        //console.log('got data chunk %s', chunk.length);
        downloaded += chunk.length;
        conn.emit('progress',
          (downloaded / total), downloaded, total, chunk.length);
        if(downloaded === total) {
          conn.removeListener('data', onData);
        }
      }

      if(res.ok) {
        scope.emit('open', conn);
        var downloaded = 0, total = parseInt(res.headers['content-length']);
        res.on('data', onData);
      }
    })
    return conn;
  }

  return revision.call(this, opts, fetch);
}

/**
 *  Remove a document attachment.
 *
 *  If rev is not specified a HEAD request is performed
 *  to fetch the latest revision.
 */
function rm(opts, cb) {
  opts = this.merge(opts);
  assert(opts.ddoc || opts.id, 'document id required to rm attachment')
  assert(opts.attname, 'attachment name required to rm attachment');
  var parts = [opts.server, opts.db, opts.ddoc || opts.id, opts.attname];
  if(opts.ddoc) {
    parts.splice(2, 0, design);
  }
  var u = this.url(parts);
  var req = {url: u, method: methods.delete};
  var scope = this;
  function remove(){
    return scope.request(req, opts, cb);
  }
  if(opts.qs && opts.qs.rev) {
    return remove();
  }else{
    return revision.call(this, opts, remove);
  }
}

/**
 *  Head a document attachment.
 */
function head(opts, cb) {
  opts = this.merge(opts);
  assert(opts.ddoc || opts.id, 'document id required to head attachment')
  assert(opts.attname, 'attachment name required to head attachment');
  var parts = [opts.server, opts.db, opts.ddoc || opts.id, opts.attname]
    , scope = this;
  if(opts.ddoc) {
    parts.splice(2, 0, design);
  }
  var u = this.url(parts);
  var req = {url: u, method: methods.head};
  return this.request(req, opts, function(err, res, doc) {
    var body = scope.getHeadDocument(
      err, res, doc, {attname: opts.attname});
    cb(err, res, body);
  });
}

Attachment.prototype.put = put;
Attachment.prototype.get = get;
Attachment.prototype.rm = rm;
Attachment.prototype.head = head;

module.exports = Attachment;
