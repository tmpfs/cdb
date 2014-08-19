var encode = ['key', 'keys', 'startkey', 'endkey'];

/**
 *  Accepts a query string object and ensures that
 *  parameters that must be JSON encoded are converted
 *  to JSON string literals.
 *
 *  Creates a copy of the source qs object.
 *
 *  @param qs The query string object.
 *
 *  @return Copy of the query string object.
 */
function stringify(qs) {
  var o = {};
  for(var z in qs) {
    o[z] = qs[z];
    if(~encode.indexOf(z)) {
      o[z] = JSON.stringify(o[z]);
    }
  }
  return o;
}

module.exports = stringify;
