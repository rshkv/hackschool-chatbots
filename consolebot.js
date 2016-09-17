var builder = require('botbuilder');
var api = require('./api.js');
var restify = require('restify');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();

console.log('What do you want to do?');

bot.dialog('/', intents);

intents.matches(/^(departures) \1/i, [
    function (session) {
        session.beginDialog('/departures');
    }
]);

intents.matches(/^departures/i, [
    function (session) {
        session.beginDialog('/departures');
    }
]);

intents.onDefault([
    function (session, results) {
        session.send('Sorry, I didn\'t quite get that :/ Try Again!');
        session.send('What do you want to do?');
    }
]);

bot.dialog('/departures', [
    function (session) {
        builder.Prompts.text(session, 'Ok! Which\'s stations departures do you want to see?');
    },
    function (session, results) {
        session.dialogData.station = results.response;
        api.getStations(results.response)
          .then(response => {
            // Access the list of stops
            var stops = response['stopLocationOrCoordLocation'];
            // Get the id of the first stop in the list (the best match)
            session.dialogData.station = stops[0]['StopLocation']['name'];
            session.send("I got this station: %s?", session.dialogData.station);
            builder.Prompts.confirm(session, "Is that right?");
            // Get departures for that stop and return a promise
            return;
          })
    },
    function (session, results, next) {
        if (!results.response) session.beginDialog('/departures');
        else next();
    },     
    function (session, results) {
        session.send('Ok, showing you departures from %s!', session.dialogData.station);

        api.getStations(session.dialogData.station)
          .then(response => {
            // Access the list of stops
            var stops = response['stopLocationOrCoordLocation'];
            // Get the id of the first stop in the list (the best match)
            var bestMatchId = stops[0]['StopLocation']['id'];
            // Get departures for that stop and return a promise
            return api.getDepartures(bestMatchId);
          })
          .then(response => {
            // Iterate list of departures
            var departures = response['Departure'];
            for (var departure of departures) {
              // Get time without seconds
              var time = departure.time.slice(0, 5);
              // Get right padded line name
              var line = (new Array(8).join(' ') + departure.name.trim()).slice(-8);
              // Print to console
              console.log(`${time} ${line} → ${departure.direction}`);
            }
          });

          session.endDialog();
    }
]);