let request = require('request');

var accessId = "hackerstolz-01102016";
var baseUrl = "http://demo.hafas.de/openapi/vbb-proxy/";

var fetchData = exports.fetchData = function(service, parameters, callback) {
  // Build the request URL
  var url = baseUrl + service + "?" + parameters;
  // Request the URL
  request(url, function(error, response, body) {
    // If the request was successful, there is no error
    // and the status code is 200
    if (!error && response.statusCode == 200) {
      // Call the callback function provided from outside 
      // with the reponse body as argument
      callback(body);
    }
    // If something was wrong, print the status code,
    // we can then check https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
    console.log(response.statusCode);
  });
}

fetchData("location.name",
  "format=json&input=innsbrucker&accessId=raschkowski-a2e3-3994ae5b60a6&type=S",
  function(body) {
    console.log(body);
  });
