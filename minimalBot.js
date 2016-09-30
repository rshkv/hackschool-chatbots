var builder = require('botbuilder');

// Connect to the console
var connector = new builder.ConsoleConnector();
connector.listen();

// Create your bot
var bot = new builder.UniversalBot(connector);
bot.dialog('/', function (session) {
  session.send('Hey, you!');
})