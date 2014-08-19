module.exports = require('./lib');
module.exports.log = {
  levels: require('./levels')
}
var config = module.exports.config = require('./config'), k;
var sections = module.exports.sections = {};
for(k in config) {
  sections[k] = k;
}

console.dir(module.exports);
