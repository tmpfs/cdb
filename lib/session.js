var util = require('util');

var AbstractCouch = require('./abstract');
var methods = require('./constants/methods');
var keys = require('./constants/parameters');

var Session = function(options) {
  AbstractCouch.apply(this, arguments);
}

util.inherits(Session, AbstractCouch);

/**
 *  Get the current session.
 */
Session.prototype.get = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, keys.session];
  var u = this.url(parts);
  var req = {url: u};
  return this.request(req, opts, cb, true);
}

/**
 *  Authenticate a session.
 */
Session.prototype.set = function(opts, cb) {
  var scope = this;
  opts = this.merge(opts);
  var parts = [opts.server, keys.session];
  var u = this.url(parts);
  var body = {name: opts.username, password: opts.password};
  var req = {
    url: u,
    method: methods.post,
    body: this.stringify(body)
  };
  // NOTE: we never specify caller and name
  // NOTE: so this request does not get pushed
  // NOTE: on the db call stack
  return this.request(req, opts, function(err, res, doc) {
    //console.log('status %s', res.statusCode);
    //console.log('res headers %j', res.headers);
    var cookie = res.headers['set-cookie'];
    if(res.statusCode === 200 && cookie) {
      var key = scope.getServerKey(req.url);
      scope.jar.user[key] = opts.username;
      scope.jar.cookie = scope.jar.cookie || {};
      scope.jar.cookie[key] = scope.jar.cookie[key] || {};
      scope.jar.cookie[key][opts.username] =
        Array.isArray(cookie) ? cookie[0] : cookie;
    }
    cb(err, res, cb);
  }, true);
}

/**
 *  Delete a login session.
 */
Session.prototype.rm = function(opts, cb) {
  opts = this.merge(opts);
  var parts = [opts.server, keys.session];
  var u = this.url(parts);
  var req = {url: u, method: methods.delete};
  if(this.jar.cookie) {
    var key = this.getServerKey(req.url);
    var user = this.jar.user[key];
    if(user && this.jar.cookie[key]) {
      delete this.jar.cookie[key][user];
    }else{
      delete this.jar.cookie[key];
    }
  }
  return this.request(req, opts, cb, true);
}

module.exports = Session;
