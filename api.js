var request = require('request');

var baseUrl = "http://demo.hafas.de/openapi/vbb-proxy/";

var fetchData = exports.fetchData = function(service, parameterString, callback) {
  var url = baseUrl + service + "?" + parameterString;
  request(url, function(error, response, body) {
    callback(body);
  });
}

fetchData(
  "location.name",
  "format=json&input=rosenthaler&accessId=hackerstolz-01102016&type=S",
  function(body) {
    console.log(body);
  });
