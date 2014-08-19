module.exports = require('./lib');
module.exports.util = require('./lib/util');
module.exports.schema = require('./lib/schema');
module.exports.log = {
  levels: require('./lib/constants/levels')
}
var config = module.exports.config = require('./lib/constants/config'), k;
var sections = module.exports.sections = {};
var map = module.exports.sections.map = {};
for(k in config) {
  sections[k] = k;
  map[k] = config[k].keys;
}

module.exports.CouchError = require('./lib/error');

module.exports.user = {
  prefix: 'org.couchdb.user:',
  db: config.couch_httpd_auth.defaults.authentication_db
}
