var encode = ['key', 'keys', 'startkey', 'endkey'];

/**
 *  Accepts a query string object and ensures that
 *  parameters that must be JSON encoded are converted
 *  to JSON string literals.
 *
 *  Creates a copy of the source qs object.
 *
 *  @param qs The query string object.
 *  @param serializer A JSON stringify implementation (optional).
 *
 *  @return Copy of the query string object.
 */
function stringify(qs, serializer) {
  serializer = serializer || JSON.stringify;
  var o = {}, z;
  for(z in qs) {
    o[z] = qs[z];
    if(~encode.indexOf(z)) {
      o[z] = serializer(o[z]);
    }
  }
  return o;
}

module.exports = stringify;
