var assert = require('assert');
var async = require('async');
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

DesignDocument.prototype.deploy = function(opts, cb) {
  var scope = this;
  // keep copy of original options
  var options = {};
  for(var k in opts) {options[k] = opts[k]};
  var info = {docs: [], ok: false};
  var uuid = typeof opts.uuid === 'function' ? opts.uuid : null;
  var olddoc = uuid ? uuid() : 'old';
  var newdoc = uuid ? uuid() : 'new';
  var newd = opts.ddoc + '-' + newdoc;
  var oldd = opts.ddoc + '-' + olddoc;

  info.summary = {ddoc: opts.ddoc, ndoc: newd, odoc: oldd};
  opts.qs = opts.qs || {};

  function rm(cb) {
    //console.log('deploy rm');
    rmold.call(scope, function(err, res, doc) {
      rmnew.call(scope, function(err, res, doc) {
        cb(null, res, doc);
      });
    })
  }

  // check if document already exists
  function exists(cb) {
    //console.log('deploy exists');
    this.head(options, function(err, res, doc) {
      info.exists = res.statusCode === 200;
      if(!info.exists) {
        scope.save(options, function(err, res, doc) {
          info.docs.push(err || doc);
          if(!err && doc) {
            info.saved = true;
            info.rev = doc.rev;
          }
          cb(err, res, doc);
        });
      }else{
        info.rev = doc.rev;
        cb(null, res, doc);
      }
    });
  }

  // create backup copy (ddoc => ddoc-old)
  function backup(cb) {
    //console.log('deploy backup');
    opts.ddoc = options.ddoc;
    opts.destination = oldd;
    this.cp(opts, function(err, res, doc) {
      info.docs.push(err || doc);
      if(!err && doc) {
        info.backup = true;
      }
      cb(err, res, doc);
    });
  }

  // upload design document (ddoc-new)
  function upload(cb) {
    //console.log('deploy upload');
    opts.ddoc = newd;
    this.save(opts, function(err, res, doc) {
      info.docs.push(err || doc);
      if(!err && doc) {
        info.upload = true;
        info.nrev = doc.rev;
      }
      cb(err, res, doc);
    });
  }

  // query a view in the design document (ddoc-new)
  function query(cb) {
    //console.log('deploy query');
    if(!opts.body || !opts.body.views) {
      return cb();
    }
    var keys = Object.keys(opts.body.views);
    if(!keys.length) return cb();
    opts.name = keys[0];
    this.view(opts, function(err, res, doc) {
      info.docs.push(err || doc);
      if(!err && doc) info.query = true;
      // wait for view index completion
      cb();
    });
  }

  // copy to destination (ddoc-new => ddoc)
  function write(cb) {
    //console.log('deploy copy to destination');
    opts.ddoc = newd;
    opts.destination = options.ddoc + '?rev=' + info.rev;
    opts.qs.rev = info.nrev;
    this.cp(opts, function(err, res, doc) {
      //console.dir(err);
      info.docs.push(err || doc);
      if(!err && doc) {
        info.write = true;
        info.rev = doc.rev;
      }
      cb(err, res, doc);
    });
  }

  // remove ddoc-new
  function rmnew(cb) {
    delete opts.qs.rev;
    opts.ddoc = newd;
    this.rm(opts, function(err, res, doc) {
      info.docs.push(err || doc);
      if(!err && doc) info.rmnew = true;
      cb(err, res, doc);
    });
  }

  // remove ddoc-old
  function rmold(cb) {
    delete opts.qs.rev;
    opts.ddoc = oldd;
    this.rm(opts, function(err, res, doc) {
      info.docs.push(err || doc);
      if(!err && doc) info.rmold = true;
      cb(err, res, doc);
    });
  }

  // cleanup stale view indices for the db
  function cleanup(cb) {
    this.cleanup(opts, cb);
  }

  var methods = [
    rm,
    exists,
    backup,
    upload,
    query,
    write,
    rmnew,
    rmold,
    cleanup
  ];

  async.eachSeries(methods, function(method, callback) {
    method.call(scope, callback);
  }, function(err) {
    info.ok = !err;
    cb(err, null, info);
  })
}

module.exports = DesignDocument;
