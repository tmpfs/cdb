var querystring = require('querystring');
var url = require('url');

function join(parts) {
  var server = parts.shift() || '';
  server = server.replace(/\/+$/, '');
  parts = parts.map(function(value) {
    return querystring.escape(value);
  })
  parts.unshift(server);
  return parts.join('/');
}

function key(u) {
  var ru = url.parse(u);
  return ru.protocol + '//' + ru.host;
}

module.exports.join = join;
module.exports.key = key;
