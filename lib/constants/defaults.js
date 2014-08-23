var config = require('./config');
module.exports.replicator = config.replicator.defaults.db;
module.exports.users = config.couch_httpd_auth.defaults.authentication_db;
