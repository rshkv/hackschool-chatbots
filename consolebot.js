var builder = require('botbuilder');
var api = require('./api.js');

var connector = new builder.ConsoleConnector().listen();
var bot = new builder.UniversalBot(connector);

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
]);