var builder = require('botbuilder');
var api = require('./api.js');

// Bot setup
var connector = new builder.ConsoleConnector();
connector.listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

// Message routing
var firstAnswer = "Hi there! What do you want to do?";
var defaultAnswer = "I'm sorry. I didn't understand. What do you want to do?";
var cancelAnswer = "No problem. What do you want to do instead?";
intents
  .onBegin(builder.DialogAction.send(firstAnswer))
  .onDefault(builder.DialogAction.send(defaultAnswer))
  .matches(/departures/i, '/departures')
  .matches(/cancel/i, builder.DialogAction.send(cancelAnswer));

// Getting departures
bot.dialog('/departures', (session, args) => {
  var input = args.matched.input;
  // Check if a 'from' was in the input
  // If no, ask for the station
  // If yes, capture the string after 'from'
  if (!input.includes('from'))
    session.beginDialog('/departures/chooseStation');
  else {
    // Use regex to capture string after 'from'
    var captureRegex = /from(.*)$/;
    var match = captureRegex.exec(input)[1];
    var stationQuery = match.trim();
    session.beginDialog('/departures/confirmStation', {stationQuery: match.trim()});
  }
});

bot.dialog('/departures/chooseStation', [
  session => {
    builder.Prompts.text(session, "Ok! Which station's departures do you want to see?");
  },
  (session, results) => {
    session.beginDialog('/departures/confirmStation', {stationQuery: results.response});
  }
]);

bot.dialog('/departures/confirmStation', [
  (session, args) => {
    api.getStations(args.stationQuery)
      .then(response => {
        // Get and save the list of stops
        var stops = response['stopLocationOrCoordLocation']
          .map(stop => { return stop['StopLocation']; });
        session.dialogData.stops = stops;

        // Join the stop names to ask which one was meant
        var stopsString = stops
          .map((stop, index) => {
            return (index + 1) + ':\t' + stop.name;
          })
          .join('\n');
        session.send("I got these stations:\n%s", stopsString);
        builder.Prompts.number(session, "Which one did you mean? (Enter number)")
      })
      .catch(error => {
        session.send('There was an error with the API:\n %s!', error.message);
        session.endDialog();
      });;
  },
  (session, results) => {
    // Get the stop for the selected index
    var selectedIndex = results.response;
    var selectedStop = session.dialogData.stops[selectedIndex - 1];
    session.beginDialog('/departures/showResults', {selectedStop: selectedStop});
  }
]);

bot.dialog('/departures/showResults', (session, args) => {
    api.getDepartures(args.selectedStop.id)
      .then(response => {
        session.send(args.selectedStop.name);

        // Show departures
        var departures = response['Departure'];
        var departureLines = departures.map(departure => {
          // Get time without seconds
          var time = departure.time.slice(0, 5);
          // Get right padded line name
          var line = (new Array(8).join(' ') + departure.name.trim()).slice(-8);
          return `${time} ${line} → ${departure.direction}`;
        });
        session.send(departureLines.join('\n'));
        session.endDialog();
      })
      .catch(error => {
        session.send('There was an error with the API:\n %s!', error.message);
        session.endDialog();
      });
  }
);