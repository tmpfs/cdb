/**
 *  Utility to strip double quotes from an ETag header.
 *
 *  @param headers Either a string etag value of an object containing
 *  an etag property.
 *
 *  @return The etag with leading and trailing double quotes removed.
 */
function etag(headers) {
  var tag = typeof(headers) === 'string' ? headers : headers.etag || '';
  return tag.replace(/^"/, '').replace(/"$/, '');
}

module.exports = etag;
