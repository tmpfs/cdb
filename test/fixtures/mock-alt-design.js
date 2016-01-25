/*jshint ignore:start */
var doc = {
  views: {
    alt: {
      map: function(doc) {
        emit(doc._id, null);
      }
    }
  }
}

module.exports = JSON.stringify(doc, require('../replacer'), 0);
/*jshint ignore:end */
