'use strict';

var Client = require('../Client');

var AUTH = null;
var HOST = 'localhost';
var PORT = 8086;
var USER = 'user';
var PASSWORD = 'password';
var DATABASE = 'database';

var c = null;

module.exports = {
  setUp: function (f) {
    c = new Client(AUTH, HOST, PORT, USER, PASSWORD, DATABASE);
    f();
  },
  tearDown: function (f) {
    f();
  },

  'getCurrentDatabase': function (t) {
    t.equal(c.getCurrentDatabase(), DATABASE);
    t.done();
  },

  'use [dbname];': function (t) {
    var NEW_DB = 'hey';
    c.query('use ' + NEW_DB, {}, function (err) {
      t.strictEqual(err, null);
      t.equal(c.getCurrentDatabase(), NEW_DB);
      t.done();
    });
  },

  'use [dbname]; should emit a change:database event': function (t) {
    var NEW_DB = 'hey';
    c.on('change:database', function (database_name) {
      t.equal(database_name, NEW_DB);
      t.done();
    });
    c.query('use ' + NEW_DB);
  },

  'quit': function (t) {
    c.on('quit', function () {
      t.done();
    });
    c.query('quit');
  },

  'use': function (t) {
    c.on('quit', function () {
      throw new Error("should not be called");
    });

    c.query('use', {}, function () {
      t.done();
    });
  },

  'exit': function (t) {
    c.on('quit', function () {
      t.done();
    });
    c.query('exit;');
  }
};
