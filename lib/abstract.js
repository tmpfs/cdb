var assert = require('assert')
  , http = require('http')
  , url = require('url')
  , util = require('util')
  , events = require('events')
  , querystring = require('querystring')
  , client = require('request')
  , logger = require('cli-logger')
  , utils = require('./util')
  , etag = utils.etag
  , CouchError = require('./error')
  , types = require('./constants/types')
  , methods = require('./constants/methods')
  , supportedEvents = {
    '401': 401,
    '403': 403,
    '409': 409
  }
  , MAX_STACK_SIZE = 32
  , stack = []
  // user keeps track of current authenticated user
  // by server key, cookie tracks cookie headers by server key and user
  , jar = {
    cookie: {}
  };

function AbstractCouch(options, server) {
  options = options || {};
  this.options = options;
  this.options.stringify = this.options.stringify || JSON.stringify;
  this.options.parser = this.options.parser || JSON.parse;
  this.jar = this.options.jar || jar;
  this.jar.cookie = this.jar.cookie || {};
  if(!this.options.log) {
    this.options.log = logger(
      {
        level: logger.NONE,
        name: options.name || 'http',
        component: options.component || 'http'
      },
      options.bitwise !== undefined ? options.bitwise : false,
      options.logger);
  }
  this.log = this.options.log;
  this.server = server;
}

util.inherits(AbstractCouch, events.EventEmitter);

function stringify(obj, replacer, indent) {
  return this.options.stringify(obj, replacer, indent);
}

function deserialize(body) {
  var doc = null;
  try{
    doc = this.options.parser(body);
  }catch(e) {
    return e;
  }
  return doc;
}


function ok(res) {
  return res && res.statusCode >= 200 && res.statusCode < 300;
}

function emitter() {
  return this.server ? this.server : this;
}

function onResponse(err, res, body, cb, req, opts, item) {
  var ok = !err && res && this.ok(res);
  var json = (res && ~res.headers['content-type'].indexOf(types.json))
    && req.method !== methods.head;
  var doc = json ? this.deserialize(body) : body;
  if(doc instanceof Error) {
    err = doc;
    doc = body;
  }
  if(!ok && res) {
    err = new CouchError(doc, res);
  }

  item.err = err;
  item.res = res;
  item.doc = doc;
  item.ok = ok;

  var status = res && res.statusCode ? res.statusCode : 0
    , code = '' + status;
  var listeners;

  if(status && supportedEvents[code]) {
    listeners = this.emitter().listeners(code);
    if(listeners.length) {
      return this.emitter().emit(code, item.err, res, doc, cb);
    }
  }

  if(ok) {
    cb(null, res, doc);
  }else{
    cb(item.err, res, doc);
  }
}

function peek() {
  if(stack && stack.length) {
    return stack[stack.length - 1];
  }
  return null;
}

function flush() {
  stack = [];
}

/**
 *  Final merge of created request object and user submitted
 *  options.
 *
 *  @param req The internal request configuration object.
 *  @param opts The user submitted request options.
 */
function getRequest(req, opts) {
  var headers = {}, z, ct = 'content-type';
  req.qs = {};
  for(z in opts.qs) {
    req.qs[z] = opts.qs[z];
  }

  if(!req.qs.rev) {
    delete req.qs.rev;
  }

  // ensure query string parameters that must be json encoded are
  req.qs = utils.stringify(
    req.qs, this.options.stringify);

  opts.headers = opts.headers || {}
  req.headers = req.headers || {}
  delete opts.headers[ct]

  // user-submitted headers cannot override
  // library default headers
  for(z in opts.headers) {
    headers[z] = opts.headers[z];
  }
  for(z in req.headers) {
    headers[z] = req.headers[z];
  }
  req.headers = headers;

  // users may also override the url, not recommended but allowed
  if(opts.url) {
    req.url = opts.url;
  }

  // users may also override the method, not recommended but allowed
  if(opts.method) {
    req.method = opts.method;
  }

  // default accept header
  if(!req.headers.accept) {
    req.headers.accept = types.json;
  }

  if(!req.headers[ct]
    && (req.method === methods.post || req.method === methods.put)
    && req.body) {
    req.headers[ct] = types.json;
  }

  if(req.body
    && req.headers[ct] === types.json
    && typeof req.body !== 'string') {
    req.body = this.stringify(req.body, null, 0);
  }

  return req;
}

function request(req, opts, cb, skip) {
  var scope = this
    , log = this.log;
  // store database requests so that
  // a request may be repeated after authentication
  var item = {req: req, opts: opts, cb: cb};
  if(!skip && !opts.retries) {
    stack.push(item);
    if(stack.length > MAX_STACK_SIZE) {
      stack.shift();
    }
  }
  req = this.getRequest(req, opts);
  //console.log('[%s] url %s', req.method || 'GET', req.url);
  var key = this.getServerKey(req.url)
    , cookie = this.jar && this.jar.cookie ? this.jar.cookie[key]: null
    , user
    , stash;

  if(cookie) {
    user = cookie.user;
  }
  if(user) {
    stash = cookie.list[user];
  }
  //console.log('key %s', key);
  //console.log('user %s', user);
  //console.log('stash %s', stash);
  if((req.headers && !req.headers.cookie) && stash) {
    req.headers.cookie = stash;
  }

  if(!opts.noop) {
    log.info('%s %s', req.method || methods.get, req.url);
    if(req.qs && Object.keys(req.qs).length) {
      log.debug('%s', querystring.stringify(req.qs));
    }
  }

  function callback(err, res, body) {
    //console.log('callback got error %s', err);
    log.info('%s %s', res ? res.statusCode : -1, req.url);
    log.debug('%s', scope.stringify(res ? res.headers : {}, undefined, 2));
    scope.onResponse(err, res, body, cb, req, opts, item);
  }

  //console.log('raw %s', req.raw);
  //
  req.method = req.method || methods.get;

  // non-operation, emit the request that would be used
  if(opts.noop) {
    var err = new CouchError({noop: true}, {statusCode: -1});
    err.reason = err.message = 'noop';
    err.code = 'ENOOP';
    this.emitter().emit('noop', err, req);
    return cb(err);
  }

  //console.dir(req)

  var conn;
  if(req.raw) {
    conn = this.raw(req, callback);
  }else{
    conn = client(req, callback);
  }
  log.debug('%s', this.stringify(conn.headers, undefined, 2));
  return conn;
}

function raw(req, cb) {
  var scope = this;
  var u = url.parse(req.url);
  req.method = req.method;
  var hopts = {
    hostname: u.hostname ,
    method: req.method,
    headers: req.headers,
    port: u.port,
    path: u.pathname
  }

  if(req.qs) {
    hopts.path += '?' + querystring.stringify(req.qs);
  }

  var client = http.request(hopts, function(res) {
    //console.log('got res %s', res.statusCode);
    client.emit('response', res);
    var ok = res.ok = scope.ok(res);
    var body;
    if(ok && req.stream) {
      res.pipe(req.stream);
    }else{
      body = new Buffer('');
      res.on('data', function(chunk) {
        body = Buffer.concat([body, chunk]);
      })
    }
    function onend() {
      cb(null, res, body);
    }
    res.once('end', onend);
  })

  if(req.body
    && (req.method === methods.post || req.method === methods.put)) {
    client.end(req.body);
  }else{
    client.end();
  }

  return client;
}

/**
 *  Repeat the last database request.
 *
 *  @param cb Replace the stashed callback function (optional).
 */
function repeat(cb) {
  var last = stack.pop();
  if(last) {
    var opts = last.opts;
    cb = cb || last.cb;
    opts.retries = opts.retries || 0;
    opts.retries++;
    return this.request(last.req, opts, cb);
  }
  throw new Error('no request available to repeat');
}

function merge(opts) {
  opts = opts || {};
  if(!opts.url) {
    opts.server = opts.server || this.options.server;
    assert(typeof(opts.server) === 'string', 'server option is required');
  }
  return opts;
}

function getHeadDocument(err, res, doc, opts) {
  opts = opts || {};
  var body = {status: res.statusCode, headers: res.headers};
  if(res.statusCode === 200) {
    body.size = parseInt(res.headers['content-length']);
    body.rev = etag(res.headers);
    if(opts.attname) {
      body.name = opts.attname;
      body.md5 = res.headers['content-md5'];
      body.type = res.headers['content-type'];
      body.encoding = res.headers['content-encoding'];
    }
  }
  return body;
}

/**
 *  Send a GET request.
 */
function get(opts, cb) {
  opts = this.merge(opts);
  var req = {method: methods.get, url: opts.url};
  return this.request(req, opts, cb);
}

/**
 *  Send a PUT request.
 */
function put(opts, cb) {
  opts = this.merge(opts);
  var req = {method: methods.put, url: opts.url, body: opts.body};
  return this.request(req, opts, cb);
}

/**
 *  Send a POST request.
 */
function post(opts, cb) {
  opts = this.merge(opts);
  var req = {method: methods.post, url: opts.url, body: opts.body};
  return this.request(req, opts, cb);
}

/**
 *  Send a DELETE request.
 */
function del(opts, cb) {
  opts = this.merge(opts);
  var req = {method: methods.delete, url: opts.url};
  return this.request(req, opts, cb);
}

/**
 *  Send a HEAD request.
 */
function head(opts, cb) {
  opts = this.merge(opts);
  var req = {method: methods.head, url: opts.url}
    , scope = this;
  return this.request(req, opts, function(err, res, doc) {
    var notfound = res && res.statusCode === 404;
    if(err && !notfound) {
      return cb(err, res);
    }
    doc = scope.getHeadDocument(err, res, doc);
    cb(null, res, doc);
  });
}

/**
 *  Send a COPY request.
 */
function copy(opts, cb) {
  opts = this.merge(opts);
  var req = {method: methods.copy, url: opts.url};
  return this.request(req, opts, cb);
}

// UTILS
AbstractCouch.prototype.stringify = stringify;
AbstractCouch.prototype.deserialize = deserialize;
AbstractCouch.prototype.ok = ok;
AbstractCouch.prototype.emitter = emitter;
AbstractCouch.prototype.onResponse = onResponse;
AbstractCouch.prototype.peek = peek;
AbstractCouch.prototype.flush = flush;
AbstractCouch.prototype.getRequest = getRequest;
AbstractCouch.prototype.request = request;
AbstractCouch.prototype.raw = raw;
AbstractCouch.prototype.repeat = repeat;
AbstractCouch.prototype.merge = merge;
AbstractCouch.prototype.getHeadDocument = getHeadDocument;
AbstractCouch.prototype.url = utils.url.join;
AbstractCouch.prototype.getServerKey = utils.url.key;

// VERBS
AbstractCouch.prototype.get = get;
AbstractCouch.prototype.put = put;
AbstractCouch.prototype.post = post;
AbstractCouch.prototype.del = del;
AbstractCouch.prototype.head = head;
AbstractCouch.prototype.copy = copy;

module.exports = AbstractCouch;
