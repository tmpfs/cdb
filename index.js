module.exports = require('./lib/server');
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

var constants = require('./lib/constants');
for(k in constants) {
  module.exports[k] = constants[k];
}

// shortcuts
module.exports.user = {
  prefix: 'org.couchdb.user:',
  db: module.exports.defaults.users
}

module.exports.replicator = module.exports.defaults.replicator;
module.exports.users = module.exports.defaults.users;
