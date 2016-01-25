// Utility to stringify functions
// for design document serialization
function replacer(key, val) {
  if(typeof val === 'function') {
    val = val.toString();
  }
  return val;
}

module.exports = replacer;
