var builder = require('botbuilder');
var request = require('request');

var connector = new builder.ConsoleConnector();
connector.listen();

var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
bot.dialog('/', intents);

intents.onDefault(function(session) {
  session.send("I'm the vbb bot!");
})

intents.matches(/departure/i, function(session) {
  session.beginDialog('/departure');
});

bot.dialog('/departure', [
  function(session) {
    builder.Prompts.text(session, "Hey! For which station?");
  },
  function(session, results) {

    fetchData('location.name', {
      input: results.response,
      type: "S",
      accessId: "hackerstolz-01102016",
      format: "json"
    }, function(body) {
      var data = JSON.parse(body);
      var bestMatch = data.stopLocationOrCoordLocation[0].StopLocation.name;
      var bestMatchId = data.stopLocationOrCoordLocation[0].StopLocation.id;
      session.userData.stationId = bestMatchId;
      builder.Prompts.confirm(session, "Did you mean:\n" + bestMatch)
    })
    
  },
  function(session, results) {
    if (results.response) {
      fetchData('departureBoard', {
        id: session.userData.stationId,
        accessId: "hackerstolz-01102016",
        format: "json"
      }, function(body) {
        var data = JSON.parse(body);
        var departures = data['Departure'];
        var departureLines = departures.map(function(departure) {
          // Get time without seconds
          var time = departure.time.slice(0, 5);
          // Get right padded line name
          var line = (new Array(8).join(' ') + departure.name.trim()).slice(-8);
          return time + " " + line + " → " + departure.direction;
        });
        session.send(departureLines.join('\n'));
        session.endDialog();
      })
    }
  }
]);

var parameterString = function(parameters) {
  var string = ""
  for (var parameter in parameters) {
    var value = parameters[parameter];
    string = string + parameter + "=" + value + "&";
  }
  return string;
};

var fetchData = function(serviceName, parameters, callbackFunc) {
  var baseUrl = "http://demo.hafas.de/openapi/vbb-proxy/";
  var requestUrl = baseUrl + serviceName + "?" + parameterString(parameters);

  request(requestUrl, function(error, response, body) {
    // Data arrived 
    callbackFunc(body);
  });
}
