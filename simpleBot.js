var builder = require('botbuilder');

var connector = new builder.ConsoleConnector();
connector.listen();

var bot = new builder.UniversalBot(connector);
bot.dialog('/', [
  function(session) {
    builder.Prompts.text(session, "Hey! What's your name?");
  },
  function (session, results) {
    session.send('Hello %s!', results.response);
  }
])
