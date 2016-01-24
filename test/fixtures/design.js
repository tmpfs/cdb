/*jshint ignore:start */
var doc = {
  views: {
    mock: {
      map: function(doc) {
        emit(doc._id, null);
      }
    }
  }
}

function replacer(key, val) {
  if(typeof val === 'function') {
    val = val.toString();
  }
  return val;
}

module.exports = JSON.stringify(doc, replacer, 0);
/*jshint ignore:end */
