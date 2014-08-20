var querystring = require('querystring');

function join(parts) {
  var server = parts.shift();
  parts = parts.map(function(value) {
    return querystring.escape(value);
  })
  parts.unshift(server);
  return parts.join('/');
}

module.exports.join = join;
