var encode = ['key', 'keys', 'startkey', 'endkey'];

/**
 *  Accepts a query string object and ensures that
 *  parameters that must be JSON encoded are converted
 *  to JSON string literals.
 *
 *  Creates a copy of the source qs object.
 *
 *  @param qs The query string object.
 *  @param stringify A JSON stringify implementation (optional).
 *
 *  @return Copy of the query string object.
 */
function stringify(qs, stringify) {
  stringify = stringify || JSON.stringify;
  var o = {}, z;
  for(z in qs) {
    o[z] = qs[z];
    if(~encode.indexOf(z)) {
      o[z] = stringify(o[z]);
    }
  }
  return o;
}

module.exports = stringify;
