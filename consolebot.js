var builder = require('botbuilder');
var api = require('./api.js');
var restify = require('restify');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.matches(/change name/, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('Ok... Changed your name to %s', session.userData.name);
    }
]);

intents.matches(/departures from/, [
	
    
    function (session, results) {
        session.send("got it");
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/profile');
        } else {
            next();
        }
    },
    function (session, results) {
        session.send('Hello %s!', session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session, 'Hi! What is your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);

/*
bot.dialog('/', [
    function (session) {
        builder.Prompts.text(session, 'Hi! Which\'s stations departures do you wanna know?');
    },
    function (session, results) {
    	session.send('Ok, showing you departures from %s!', results.response);
    	api.getStations(results.response)
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
]);*/