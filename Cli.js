'use strict';

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var Client = require('./Client');

function startRepl(prompt, client, fPrint) {
  rl.question(prompt + ' ', function(query) {
    rl.pause();

    client.query(query, {}, function(err, res) {
      fPrint(err, res);
      rl.resume();
      setImmediate(startRepl.bind(null, prompt, client, fPrint));
    });
  });
}

module.exports = function Cli(prompt, host, port, user, password, database, fPrint) {
  fPrint = fPrint || console.log.bind(console);

  rl.setPrompt(prompt);

  var client = new Client(host, port, user, password, database);

  fPrint(null, ['Connecting to ', 'http://', host, ':', port, '/db/', database, ' ...'].join(''));

  client.on('quit', function(){
    return process.exit(1);
  });

  client.existDatabase(database, function(err, exist) {
    if (err) {
      fPrint(err);
      return process.exit(1);
    }

    if (!exist) {
      fPrint(['Database', database, 'does not exist in InfluxDB'].join(' '));
      return process.exit(1);
    }

    fPrint(null, ['✔', 'ready'].join(' '));

    startRepl(prompt, client, fPrint);
  });

};
