'use strict';

var request = require('request');
var Url = require('url');
var _ = require('lodash');
var EventEmitter = require('events').EventEmitter;

/**
 * [Client description]
 * @param {String=} auth    basic auth. eg. "user:password"
 * @param {String} host     [description]
 * @param {String} port     [description]
 * @param {String} secure   [description]
 * @param {String} user     [description]
 * @param {String} password [description]
 * @param {String} database [description]
 */
function Client(basic_auth, host, port, secure, user, password, database) {
  EventEmitter.call(this);
  this.basic_auth = basic_auth;
  this.host = host;
  this.port = port;
  this.user = user;
  this.password = password;
  this.database = database;
  this.protocol = secure ? 'https:' : 'http:';
}

function setCurrentDatabase(self, database) {
  self.database = database;
  self.emit('change:database', database);
}

function url(ctx, db, query) {
  return Url.format({
    protocol: ctx.protocol,
    auth: ctx.basic_auth,
    hostname: ctx.host,
    port: ctx.port,
    pathname: db,
    query: _.extend({
      u: ctx.user,
      p: ctx.password
    }, query || {})
  });
}

function parseCallback(f, start) {
  return function (err, res, body) {
    var elapsed = +new Date() - start;
    if (err) {
      return f(err, null, elapsed);
    }
    if (res.statusCode < 200 || res.statusCode >= 300) {
      return f(new Error(body), null, elapsed);
    }
    return f(null, body, elapsed);
  };
}

function parseVersionCallback(f, start) {
  return function (err, res, body) {
    if (err) {
      return f(err, null, null);
    }
    return f(null, res.headers['x-influxdb-version'], null);
  }
}

Client.prototype.query = function (query, options, f) {
  query = (query || '').trim();
  options = options || {};
  f = f || function () {};

  var USE_DATABASE_CMD = /use\s([^;]*)/g.exec(query);
  if (USE_DATABASE_CMD) {
    setCurrentDatabase(this, USE_DATABASE_CMD[1]);
    return f(null);
  }

  // user just pressed enter
  if (query == '') {
    return f(null, '');
  };

  if (query.toLowerCase().indexOf('quit') !== -1 || query.toLowerCase().indexOf('exit') !== -1) {
    this.emit('quit');
    return f(null);
  }

  var start = +new Date();
  var params = _.defaults(options, {
    q: query,
    time_precision: 'm',
    chunked: false
  });


  // special command to ping the server
  if (query.toLowerCase() === 'ping') {
    request({
      url: url(this, 'ping', params),
      json: true
    }, parseCallback(f, start));
    return;
  }

  //special command to get the version from the server.
  if (query.toLowerCase() === 'version') {
    request({
      url: url(this, 'ping', params),
      json: true
    }, parseVersionCallback(f, start));
    return;
  }

  // console.log(url('db/' + database + '/series', params));
  request({
    url: url(this, 'db/' + this.database + '/series', params),
    json: true
  }, parseCallback(f, start));
};

/**
 * [canConnect description]
 * @param  {Function} f(err)
 */
Client.prototype.canConnect = function (f) {
  var _url = url(this, 'ping', {});
  request({
    url: _url,
    json: true
  }, function (err, res, body) {
    if (err) {
      return f(err);
    }

    if (body.status !== 'ok') {
      return f(new Error('Can\'t connect to database, got: \n' + body));
    }

    f();
  });
};

Client.prototype.getCurrentDatabase = function () {
  return this.database;
};

_.extend(Client.prototype, EventEmitter.prototype);

module.exports = Client;
