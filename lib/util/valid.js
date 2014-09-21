//Only lowercase characters (a-z), digits (0-9), and any
//of the characters _, $, (, ), +, -, and / are allowed. Must begin with a letter.

var defaults = require('../constants/defaults')
  , querystring = require('querystring');

function valid(name) {
  name = querystring.unescape(name);
  if(reserved(name)) {
    return true;
  }
  return /^[a-z]([a-z0-9_$()+/-])*$/.test(name);
}

function reserved(name) {
  return name === defaults.replicator || name === defaults.users;
}

valid.reserved = reserved;

module.exports = valid;
