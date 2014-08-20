//Only lowercase characters (a-z), digits (0-9), and any
//of the characters _, $, (, ), +, -, and / are allowed. Must begin with a letter.

var config = require('../constants/config');
function valid(name) {
  if(name === config.replicator.defaults.db
    || name === config.couch_httpd_auth.defaults.authentication_db) {
    return true;
  }
  return /^[a-z]([a-z0-9_\$\(\)\+\/-])+$/.test(name);
}

module.exports = valid;
