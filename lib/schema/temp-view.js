var descriptor = {
  type: 'object',
  fields: {
    map: {type: 'function', required: true},
    // SEE: async-validate#11
    //reduce: {type: ['function', 'string']}
  }
}

module.exports = descriptor;
