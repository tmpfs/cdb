var assert = require('assert');
var http = require('http');
var url = require('url');
var util = require('util');
var events = require('events');
var querystring = require('querystring');
var request = require('request');
var logger = require('cli-logger');
var utils = require('./util');
var CouchError = require('./error');
var types = require('./constants/types');
var methods = require('./constants/methods');

var MAX_STACK_SIZE = 32;
var stack = [];

// user keeps track of current authenticated user
// by server key, cookie tracks cookie headers by server key and user
var auth = {
  user: {},
  cookie: {}
};

var AbstractCouch = function(options) {
  this.options = options || {};
  this.options.stringify = this.options.stringify || JSON.stringify;
  this.options.parser = this.options.parser || JSON.parse;
  this.auth = auth;
  this.log = logger({level: logger.NONE});
}

util.inherits(AbstractCouch, events.EventEmitter);

AbstractCouch.prototype.url = utils.url.join;
AbstractCouch.prototype.getServerKey = utils.url.key;

AbstractCouch.prototype.stringify = function(obj, replacer, indent) {
  return this.options.stringify(obj, replacer, indent);
}

AbstractCouch.prototype.deserialize = function(body) {
  var doc = null;
  try{
    doc = this.options.parser(body);
  }catch(e) {
    return e;
  }
  return doc;
}


AbstractCouch.prototype.wrap = function(err, res) {
  var status = res && res.statusCode ? res.statusCode : 500;
  var e = new Error(err.message);
  e.stack = err.stack;
  e.status = status;
  if(err.code) e.code = err.code;
  return e;
}

AbstractCouch.prototype.ok = function(res) {
  return res && res.statusCode >= 200 && res.statusCode < 300;
}

AbstractCouch.prototype.getRequestBody = function(body) {
  if(typeof body !== 'string') {
    return this.stringify(body);
  }
  return body;
}

AbstractCouch.prototype.onResponse = function(
  err, res, body, cb, req, opts, item) {
  var ok = !err && res && this.ok(res);
  var json = (res && res.headers['content-type'] === types.json)
    && req.method !== methods.head;
  var doc = json ? this.deserialize(body) : body;
  if(doc instanceof Error) {
    err = doc;
  }
  if(!ok) {
    if(res) {
      err = new CouchError(doc, res);
    }else{
      err = this.wrap(err, res);
    }
  }
  item.err = err;
  item.res = res;
  item.doc = doc;
  item.ok = ok;
  if(ok) {
    cb(null, res, doc);
  }else{
    cb(item.err, res, doc);
  }
}

AbstractCouch.prototype.peek = function() {
  if(stack && stack.length) {
    return stack[stack.length - 1];
  }
  return null;
}

/**
 *  Final merge of created request object and user submitted
 *  options.
 *
 *  @param req The internal request configuration object.
 *  @param opts The user submitted request options.
 */
AbstractCouch.prototype.getRequest = function(req, opts) {
  req.qs = opts.qs;
  opts.headers = opts.headers || {}

  // user-submitted headers cannot override
  // library default headers
  var headers = {}, z;
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

  if(!req.headers['content-type']
    && (req.method === methods.post || req.method === methods.put)
    && req.body) {
    req.headers['content-type'] = types.json;
  }

  return req;
}

AbstractCouch.prototype.request = function(req, opts, cb, skip) {
  var scope = this, log = this.log;
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
  var key = this.getServerKey(req.url);
  var user = this.auth.user[key];
  //console.log('key %s', key);
  //console.log('user %s', user);
  if((req.headers && !req.headers.cookie)
    && user && this.auth.cookie[key][user]) {
    req.headers.cookie = this.auth.cookie[key][user];
  }
  log.info('[%s] %s', req.method || 'GET', req.url);
  if(log.debug() && Object.keys(req.qs || {}).length) {
    log.debug('%s', querystring.stringify(req.qs));
  }
  function callback(err, res, body) {
    //console.log('callback got error %s', err);
    log.info('[%s] %s', res.statusCode, req.url);
    if(log.trace()) {
      log.trace('%s', scope.stringify(res.headers, undefined, 2));
    }
    scope.onResponse(err, res, body, cb, req, opts, item);
  }
  //console.log('raw %s', req.raw);
  var conn;
  if(req.raw) {
    conn = this.req(req, callback);
  }else{
    conn = request(req, callback);
  }
  if(log.trace()) {
    log.trace('%s', this.stringify(conn.headers, undefined, 2));
  }
  return conn;
}

AbstractCouch.prototype.req = function(req, cb) {
  var scope = this;
  var u = url.parse(req.url);
  req.method = req.method || methods.get;
  var hopts = {
    hostname: u.hostname ,
    method: req.method,
    headers: req.headers || {},
    port: u.port,
    path: u.pathname,
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
AbstractCouch.prototype.repeat = function(cb) {
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

AbstractCouch.prototype.merge = function(opts) {
  opts = opts || {};
  opts.server = opts.server || this.options.server;
  assert(typeof(opts.server) === 'string', 'server option is required');
  return opts;
}

AbstractCouch.prototype.getErrorDocumentByStatusCode = function(code) {
  var doc = {code: code};
  switch(code) {
    case 400:
      doc.error = 'bad_request';
      break;
    case 404:
      doc.error = 'not_found';
      break;
  }
  return doc;
}


module.exports = AbstractCouch;
