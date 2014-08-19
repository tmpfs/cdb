module.exports = require('./lib');
module.exports.util = require('./lib/util');
module.exports.schema = require('./lib/schema');
module.exports.log = {
  levels: require('./levels')
}
var config = module.exports.config = require('./config'), k;
config.admins = {name: 'admins', keys: {}, defaults: {}};
var sections = module.exports.sections = {};
var map = module.exports.sections.map = {};
for(k in config) {
  sections[k] = k;
  map[k] = config[k].keys;
}

//console.dir(sections);
//console.dir(module.exports);
