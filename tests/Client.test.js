'use strict';

var Client = require('../Client');

var HOST     = 'localhost';
var PORT     = 8086;
var USER     = 'user';
var PASSWORD = 'password';
var DATABASE = 'database';

var c = null;

module.exports = {
  setUp: function (f) {
    c = Client(HOST, PORT, USER, PASSWORD, DATABASE);
    f();
  },
  tearDown: function (f) {
    f();
  },

  'getCurrentDatabase': function(t){
    t.equal(c.getCurrentDatabase(), DATABASE);
    t.done();
  },

  'use [dbname];': function(t){
    var NEW_DB = 'hey';
    var c = Client(HOST, PORT, USER, PASSWORD, DATABASE);
    c.query('use '+NEW_DB, {}, function(err, database){
      t.strictEqual(err, null);
      t.strictEqual(database, NEW_DB);
      t.equal(c.getCurrentDatabase(), NEW_DB);
      t.done();
    });
  }
};
