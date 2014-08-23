//Only lowercase characters (a-z), digits (0-9), and any
//of the characters _, $, (, ), +, -, and / are allowed. Must begin with a letter.

var defaults = require('../constants/defaults');
function valid(name) {
  if(name === defaults.replicator || name === defaults.users) {
    return true;
  }
  return /^[a-z]([a-z0-9_\$\(\)\+\/-])+$/.test(name);
}

module.exports = valid;
