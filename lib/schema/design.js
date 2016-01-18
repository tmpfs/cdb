var descriptor = {
  type: 'object',
  fields: {
    _id: {type: 'string'},
    language: {type: 'string'},
    lib: {type: 'object'},
    options: {type: 'object'},
    filters: {type: 'object'},
    lists: {type: 'object'},
    rewrites: {type: 'array'},
    shows: {type: 'object'},
    updates: {type: 'object'},
    validate_doc_update: {type: 'function'},
    views: {type: 'object'}
  }
}

module.exports = descriptor;
