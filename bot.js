var api = require('./playground.js');

var callbackFunc = function(body) {
  var id = JSON.parse(body).stopLocationOrCoordLocation[0].StopLocation.id;
  api.fetchData('departureBoard', {
    accessId: "hackerstolz-01102016",
    format: "json",
    id: id
  }, function (body) {
    console.log(JSON.parse(body)) 
  })
};

var data = api.fetchData('location.name', {
  accessId: "hackerstolz-01102016",
  format: "json",
  input: "rosenthaler",
  type: "S"
}, callbackFunc)
