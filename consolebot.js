var builder = require('botbuilder');
var api = require('./api.js');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();

console.log('What do you want to do?');

bot.dialog('/', new builder.IntentDialog()
    .matches(/departures/i, '/departures')
    .onDefault(builder.DialogAction.send("I'm sorry. I didn't understand. What do you want to do?"))
);

bot.dialog('/departures', [
    function (session, args) {
        if (args.matched.input.indexOf("from") == -1) session.beginDialog('/departures/chooseStation');
        else {
            str = args.matched.input + " ";
            pos = str.indexOf("from") + 6;
            var left = str.slice(0, pos + 1).search(/\S+$/),
                right = str.slice(pos).search(/\s/);
            if (right < 0) {
                session.privateConversationData.stationName = str.slice(left);
            }
            session.privateConversationData.stationName = str.slice(left, right + pos);
            session.beginDialog('/departures/confirmStation');
        }
    }
]);

bot.dialog('/departures/chooseStation', [
    function (session) {
        builder.Prompts.text(session, 'Ok! Which\'s stations departures do you want to see?');
    },
    function (session, results) {
        session.privateConversationData.stationName = results.response;
        session.beginDialog('/departures/confirmStation');
    }
]);

bot.dialog('/departures/confirmStation', [
    function (session, args) {
        api.getStations(session.privateConversationData.stationName)
          .then(response => {
            // Access the list of stops
            var stops = response['stopLocationOrCoordLocation'];
            // Get the name and id of the first stop in the list (the best match)
            session.privateConversationData.stationId = stops[0]['StopLocation']['id'];
            session.privateConversationData.stationName = stops[0]['StopLocation']['name'];

            session.send("I got this station: %s?", session.privateConversationData.stationName);
            builder.Prompts.confirm(session, "Is that right?");
            // Get departures for that stop and return a promise
            return;
          });
    },
    function (session, results) {
        if (results.response) session.beginDialog('/departures/showResults');
        else session.beginDialog('/departures/chooseStation');
        session.endDialog();
    }
]);

bot.dialog('/departures/showResults', [ 
    function (session, results) {

        api.getDepartures(session.privateConversationData.stationId)
          .then(response => {

            // Iterate list of departures
            var departures = response['Departure'];

            session.send('Ok, showing you departures from %s!', session.privateConversationData.stationName);

            for (var departure of departures) {
              // Get time without seconds
              var time = departure.time.slice(0, 5);
              // Get right padded line name
              var line = (new Array(8).join(' ') + departure.name.trim()).slice(-8);
              // Print to console
              console.log(`${time} ${line} → ${departure.direction}`);
            }

            session.endDialog();
          })
          .catch(error => {
            session.send('There was an error with the api:\n %s!', error);
            session.endDialog();
          });
    }
]);