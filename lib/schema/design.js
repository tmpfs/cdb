var descriptor = {
  _id: {type: 'string'},
  language: {type: 'string'},
  options: {type: 'object'},
  filters: {type: 'object'},
  lists: {type: 'object'},
  rewrites: {type: 'array'},
  shows: {type: 'object'},
  updates: {type: 'object'},
  validate_doc_update: {type: 'method'},
  views: {type: 'object'},
}

module.exports = descriptor;
