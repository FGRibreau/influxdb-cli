'use strict';

var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var Client = require('./Client');

function startRepl(fprompt, client, fPrint) {
  var prompt = fprompt(client.getCurrentDatabase());
  rl.question(prompt + ' ', function (query) {
    rl.pause();

    client.query(query, {}, function (err, res, elapsed) {
      fPrint(prompt, err, res, elapsed);
      rl.resume();
      setImmediate(startRepl.bind(null, fprompt, client, fPrint));
    });
  });
}

function Cli(fprompt, basic_auth, host, port, secure, user, password, database, fPrint) {
  fPrint = fPrint || console.log.bind(console);

  var client = new Client(basic_auth, host, port, secure, user, password, database);
  var prompt = fprompt(client.getCurrentDatabase());

  rl.setPrompt(prompt);

  var protocol = secure ? 'https://' : 'http://';

  fPrint(prompt, null, ['Connecting to ', protocol, basic_auth, host, ':', port, '/db/', database, ' ...'].join(''));

  client.on('change:database', function (database_name) {
    rl.setPrompt(fprompt(database_name));
  });

  client.on('quit', function () {
    console.log('Quit');
    return process.exit(1);
  });

  client.canConnect(function (err) {
    if (err) {
      fPrint(prompt, err);
      return process.exit(1);
    }

    fPrint(prompt, null, ['✔', 'ready'].join(' '));

    startRepl(fprompt, client, fPrint);
  });

}

module.exports = Cli;
