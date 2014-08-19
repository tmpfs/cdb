//Only lowercase characters (a-z), digits (0-9), and any
//of the characters _, $, (, ), +, -, and / are allowed. Must begin with a letter.
//
function valid(name) {
  return /^[a-z]([a-z0-9_\$\(\)\+\/-])+$/.test(name);
}

module.exports.valid = valid;
