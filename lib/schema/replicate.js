var descriptor = {
  type: 'object',
  fields: {
    source: {type: 'string', required: true},
    target: {type: 'string', required: true},
    continuous: {type: 'boolean'},
    cancel: {type: 'boolean'},
    create_target: {type: 'boolean'},
    proxy: {type: 'string'},
    doc_ids: {type: 'array'}
  }
}

module.exports = descriptor;
