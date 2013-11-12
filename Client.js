var request = require('request');
var Url = require('url');
var _ = require('lodash');

module.exports = function Client(host, port, user, password, database) {
  var _database = database;

  function url(db, query) {
    return Url.format({
      protocol: 'http:',
      hostname: host,
      port: port,
      pathname: db,
      query: _.extend({
        u: user,
        p: password
      }, query || {})
    });
  }

  function parseCallback(f) {
    return function(err, res, body) {
      if (err) {
        return f(err);
      }
      if (res.statusCode < 200 || res.statusCode >= 300) {
        return f(new Error(body));
      }
      return f(null, body);
    };
  }

  // API
  return {
    query: function(query, options, f) {
      query = query || '';

      var USE_DATABASE_CMD = /use\s([^;]*)/g.exec(query);
      if(USE_DATABASE_CMD){
        _database = USE_DATABASE_CMD[1];
        return f(null, _database);
      }

      var params = _.defaults(options, {
        q: query,
        time_precision: 'm',
        chunked: false,
      });

      // console.log(url('db/' + database + '/series', params));
      request({
        url: url('db/' + database + '/series', params),
        json: true
      }, parseCallback(f));
    },

    existDatabase: function(dbName, f) {
      return f(null, true);

      // Only work for admins
      // @todo fix this
      // console.log(url('dbs'));
      // request({
      //   url: url('db/' + database + '/series'),
      //   json: true
      // }, parseCallback(function(err, dbs) {
      //   if (err) {
      //     return f(err, dbs);
      //   }

      //   var exist = _.find(dbs, function(db) {
      //     return db.name === dbName;
      //   });


      //   return f(err, exist);
      // }));
    },
    getCurrentDatabase: function(){
      return _database;
    }
  };
};
