var util = require('util');

function CouchError(doc, res) {
  var def = 'unknown_db_error';
  // head request with 404
  if(!doc && res && res.statusCode === 404) {
    def = 'not_found';
  }
  doc = doc || {};
  this.doc = doc;
  this.res = res ? {statusCode: res.statusCode, headers: res.headers} : null;
  if(this.res && res.req) {
    this.res.req = {
      method: res.req.method,
      url: res.request.href,
      headers: res.request.headers
    }
  }
  this.reason = doc.error;
  if(doc.reason && /^[a-z0-9_]+$/i.test(doc.reason)
    && doc.reason !== 'missing') {
    this.reason = doc.reason;
  }
  if(!this.reason) {
    this.reason = def;
  }
  this.status = res ? res.statusCode : 500;
  Error.call(this);
}

util.inherits(CouchError, Error);

function getErrorKey() {
  return 'E' + this.reason.toUpperCase();
}

CouchError.prototype.getErrorKey = getErrorKey;

module.exports = CouchError;
