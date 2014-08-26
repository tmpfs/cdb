var assert = require('assert');
var fs = require('fs');
var etag = require('./util/etag');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');
var Readable = require('stream').Readable;
var Writable = require('stream').Writable;

var Document = require('./document');

function revision(opts, cb) {
  var scope = this;
  // revision was specified
  if(opts.qs && opts.qs.rev) {
    return cb.call(scope);
  // attempt to get latest revision
  }else{
    var doc = Document(this);
    return doc.head(opts, function onhead(err, res, doc) {
      if(err) return cb(err, res, doc);
      opts.qs = opts.qs || {};
      opts.qs.rev = doc.rev;
      return cb.call(scope);
    })
  }
}

/**
 *  Insert or update a document attachment (upload).
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
        conn.emit('progress',
          (uploaded / total), uploaded, total, chunk.length);
        if(uploaded === total) {
          rs.removeListener('data', ondata);
        }
      }
      rs.on('data', ondata);
    }
    scope.emit('open', conn, fstats);
    rs.pipe(conn);
    return conn;
  }

  if(opts.progress && !isStream) {
    fs.stat(opts.file, function(err, stats) {
      if(err) return cb(err);
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
  assert(opts.id, 'document id required to get attachment')
  assert(opts.attname, 'attachment name required to get attachment');
  assert(opts.file, 'output file is required to get attachment');
  var u = this.url([opts.server, opts.db, opts.id, opts.attname]);
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
      if(res.ok) {
        scope.emit('open', conn);
        var downloaded = 0, total = parseInt(res.headers['content-length']);
        function ondata(chunk) {
          //console.log('got data chunk %s', chunk.length);
          downloaded += chunk.length;
          conn.emit('progress',
            (downloaded / total), downloaded, total, chunk.length);
          if(downloaded === total) {
            conn.removeListener('data', ondata);
          }
        }
        res.on('data', ondata);
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
  var scope = this;
  opts = this.merge(opts);
  assert(opts.id, 'document id required to rm attachment')
  assert(opts.attname, 'attachment name required to rm attachment');
  var u = this.url([opts.server, opts.db, opts.id, opts.attname]);
  var req = {url: u, method: methods.delete};
  function remove(){
    return this.request(req, opts, cb);
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
  assert(opts.id, 'document id required to get attachment')
  assert(opts.attname, 'attachment name required to get attachment');
  var u = this.url([opts.server, opts.db, opts.id, opts.attname]);
  var req = {url: u, method: methods.head};
  return this.request(req, opts, function(err, res, doc) {
    if(err) return cb(err, res);
    var doc = {
      name: opts.attname,
      size: parseInt(res.headers['content-length']),
      type: res.headers['content-type'],
      md5: res.headers['content-md5']
    };
    if(res.headers['content-encoding']) {
      doc.encoding = res.headers['content-encoding'];
    }
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
