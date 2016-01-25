/*jshint ignore:start */
var doc = {
  views: {
    mock: {
      map: function(doc) {
        emit(doc._id, null);
      }
    }
  },
  lists: {
    mock: function(head, req) {
      start({
        'headers': {
          'Content-Type': 'application/json'
        }
      });
      var doc = [], row;
      while(row = getRow()){
        doc.push(row);
      }
      send(toJSON(doc));
    }
  },
  shows: {
    mock: function(doc, req) {
      if (!doc) {
        return {json: {error: 'missing', reason: 'no document to show'}}
      } else {
        return {json: doc}
      }
    }
  },
  updates: {
    mock: function(doc, req) {
      if(!doc){
        return [null, {code: 404,
          json:
            {
              error: 'missing',
              reason: 'no document to update'
            }
        }];
      }else{
        if(req.body) {
          // assuming json input
          req.body = JSON.parse(req.body);
          doc.list.push(req.body);
        }
        return [doc, {json: {ok: true}}];
      }
    }
  },
  rewrites: [
    {from: '/foo', to: '../../bar'}
  ]
}

module.exports = JSON.stringify(doc, require('../replacer'), 0);
/*jshint ignore:end */
