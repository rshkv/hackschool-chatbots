var api = require('./api.js');


// We provide a search string and
// get a list of stations (with ids that we can use later)
var query = 'rosenthaler';
api.getStations(query)
  .then(response => console.log(response))
  .catch(error => console.error(error));


// We provide the id of a station and
// get a list of departures (with times and directions)
var id = 'A=1@O=U Rosenthaler Platz (Berlin)@X=13401397@Y=52529778@U=86@L=009100023@B=1@V=3.9,@p=1471526550@';
api.getDepartures(id)
  .then(response => console.log(response))
  .catch(error => console.error(error));


// We provide a search string and get a
// list of departures for the best-matching station
var query = 'rosenthaler';
api.getStations(query)
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
