var async = require('async')
  , util = require('util')
  , DatabaseDocument = require('./document')
  , methods = require('./constants/methods')
  , keys = require('./constants/parameters');

function DesignDocument() {
  DatabaseDocument.apply(this, arguments);
}

util.inherits(DesignDocument, DatabaseDocument);

/**
 *  Prepend design document prefix.
 */
function prefix(id) {
  var design = keys.design + '/';
  if(id.indexOf(design) !== 0) {
    return design + id;
  }
  return id;
}

/**
 *  Get design document information.
 */
function info(opts, cb) {
  opts = this.merge(opts);
  var u = this.url([opts.server, opts.db, keys.design, opts.ddoc, keys.info]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

/**
 *  Query a design document view.
 */
function view(opts, cb) {
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
 *  Put or post to an update handler.
 */
function update(opts, cb) {
  opts = this.merge(opts);
  var parts = [
    opts.server,
    opts.db,
    keys.design,
    opts.ddoc,
    keys.update,
    opts.name
  ];
  if(opts.id) {
    parts.push(opts.id);
  }
  var u = this.url(parts);
  var req = opts.id
    ? {url: u, method: methods.put, body: opts.body}
    : {url: u, method: methods.post};
  return this.request(req, opts, cb);
}

/**
 *  Show a document.
 */
function show(opts, cb) {
  opts = this.merge(opts);
  var parts = [
    opts.server,
    opts.db,
    keys.design,
    opts.ddoc,
    keys.show,
    opts.name
  ];
  if(opts.id) {
    parts.push(opts.id);
  }
  var u = this.url(parts);
  var req = {url: u, method: methods.post};
  return this.request(req, opts, cb);
}

/**
 *  Run a list function with a view.
 */
function list(opts, cb) {
  opts = this.merge(opts);
  var parts = [
    opts.server,
    opts.db,
    keys.design,
    opts.ddoc,
    keys.list,
    opts.name
  ];
  if(opts.oddoc) {
    parts.push(opts.oddoc);
  }
  if(opts.view) {
    parts.push(opts.view);
  }
  var u = this.url(parts);
  var req = {url: u, method: methods.get};
  return this.request(req, opts, cb);
}

/**
 *  Execute against a rewrite rule.
 */
function rewrite(opts, cb) {
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
function ls(opts, cb) {
  if(typeof opts === 'function') {
    cb = opts;
    opts = null;
  }
  opts = this.merge(opts);
  opts.qs = opts.qs || {};
  opts.qs.startkey = keys.design;
  opts.qs.endkey = keys.design + '0';
  var u = this.url([opts.server, opts.db, keys.docs]);
  var req = {url: u};
  return this.request(req, opts, cb);
}

function deploy(opts, cb) {
  var scope = this;
  // keep copy of original options
  var options = {};
  for(var k in opts) {
    options[k] = opts[k]
  }
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
    rmold.call(scope, function(/*err, res, doc*/) {
      rmnew.call(scope, function(err, res, doc) {
        cb(null, res, doc);
      });
    })
  }

  // check if document already exists
  function exists(cb) {
    this.head(options, function(err, res, doc) {
      info.exists = res.statusCode === 200;
      //console.log('deploy exists %s', info.exists);
      //console.log('deploy head %j', doc);
      //console.dir(options);
      if(!info.exists) {
        scope.save(options, function(err, res, doc) {
          info.docs.push(err || doc);
          //console.log('saved document... %j', doc);
          info.saved = Boolean(!err && doc);
          info.rev = doc.rev;
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
      info.backup = Boolean(!err && doc);
      cb(err, res, doc);
    });
  }

  // upload design document (ddoc-new)
  function upload(cb) {
    //console.log('deploy upload');
    opts.ddoc = newd;
    this.save(opts, function(err, res, doc) {
      info.docs.push(err || doc);
      info.upload = Boolean(!err && doc);
      info.nrev = doc.rev;
      cb(err, res, doc);
    });
  }

  // query a view in the design document (ddoc-new)
  function query(cb) {
    //console.log('deploy query: ' + opts.body);
    //console.log('deploy query: ' + typeof opts.body);
    //console.log('deploy query: ' + opts.body.views);
    if(typeof opts.body === 'string') {
      try {
        opts.body = JSON.parse(opts.body);
      }catch(e) {
        /* istanbul ignore next */
        return cb(e);
      }
    }
    if(!opts.body || !opts.body.views) {
      return cb();
    }
    var keys = Object.keys(opts.body.views);
    if(!keys.length) {
      return cb();
    }
    opts.name = keys[0];
    this.view(opts, function(err, res, doc) {
      info.docs.push(err || doc);
      info.query = Boolean(!err && doc);
      var retries = 0
        , interval
        , max = opts.retries || 60
        , duration = opts.duration || 1000;

      // wait for view index completion
      function retry() {
        scope.info(opts, function(err, res, doc) {
          /* istanbul ignore next: not going to mock error on view status */
          if(err) {
            return cb(err, res, doc);
          }

          retries++;

          /* istanbul ignore else */
          if(!err && doc
            && doc.view_index && doc.view_index.updater_running === false) {
            clearInterval(interval);
            return cb(err, res, doc);
          }

          /* istanbul ignore next: don't want to mock slow view index */
          if(retries >= max) {
            clearInterval(interval);
            var e = new Error('view index query retries exceeded');
            info.docs.push(e);
            return cb(e, res, doc);
          }
        });
      }
      interval = setInterval(retry, duration);
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
      info.write = Boolean(!err && doc);
      info.rev = doc.rev;
      cb(err, res, doc);
    });
  }

  // remove ddoc-new
  function rmnew(cb) {
    delete opts.qs.rev;
    opts.ddoc = newd;
    this.rm(opts, function(err, res, doc) {
      info.docs.push(err || doc);
      info.rmnew = Boolean(!err && doc);
      cb(err, res, doc);
    });
  }

  // remove ddoc-old
  function rmold(cb) {
    delete opts.qs.rev;
    opts.ddoc = oldd;
    this.rm(opts, function(err, res, doc) {
      info.docs.push(err || doc);
      info.rmold = Boolean(!err && doc);
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
    //console.dir('completed')
    //console.dir(info)
    info.ok = !err;
    cb(err, null, info);
  })
}


DesignDocument.prototype.prefix = prefix;
DesignDocument.prototype.info = info;
DesignDocument.prototype.view = view;
DesignDocument.prototype.update = update;
DesignDocument.prototype.show = show;
DesignDocument.prototype.list = list;
DesignDocument.prototype.rewrite = rewrite;
DesignDocument.prototype.ls = ls;
DesignDocument.prototype.deploy = deploy;

module.exports = DesignDocument;
