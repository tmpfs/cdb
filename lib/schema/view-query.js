var descriptor = {
  conflicts: {type: 'boolean'},
  descending: {type: 'boolean'},
  endkey: {type: 'string'},
  end_key: {type: 'string'},
  endkey_docid: {type: 'string'},
  end_key_doc_id: {type: 'string'},
  group: {type: 'boolean'},
  group_level: {type: 'integer'},
  include_docs: {type: 'boolean'},
  attachments: {type: 'boolean'},
  att_encoding_info: {type: 'boolean'},
  inclusive_end: {type: 'boolean'},
  key: {type: 'string'},
  limit: {type: 'integer'},
  reduce: {type: 'boolean'},
  skip: {type: 'integer'},
  stale: {type: 'string', enum: ['ok', 'update_after']},
  startkey: {type: 'string'},
  start_key: {type: 'string'},
  startkey_docid: {type: 'string'},
  start_key_doc_id: {type: 'string'},
  update_seq: {type: 'boolean'}
}

module.exports = descriptor;
