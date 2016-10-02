/* 
Don't forget to enter the Access Id
*/
var request = require('request');

var baseUrl = "http://demo.hafas.de/openapi/vbb-proxy/";

var parameterString = function(parameters) {
  var string = ""
  for (var parameter in parameters) {
    var value = parameters[parameter];
    string = string + parameter + "=" + value + "&";
  }
  return string;
};

var fetchData = function(service, parameters, callback) {
  var url = baseUrl + service + "?" + parameterString(parameters);
  request(url, function(error, response) {
    var body = JSON.parse(response.body);
    callback(body);
  });
}

fetchData(
  "location.name", {
    format: "json",
    input: "rosenthaler",
    accessId: "ACCESS_ID_HERE",
    type: "S"
  },
  function(body) {
    console.log(body);
  });
