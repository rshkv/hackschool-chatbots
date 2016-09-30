fs = require('fs');

fs.readFile('tokenStrings', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }

  var originalString = "hackerstolz";
  var shiftedString = "";

  for(var i = 0; i < originalString.length; i++) {
  	shiftedString = shiftedString + String.fromCharCode(originalString.charCodeAt(i) - 2);
  }

  var dataRight = data.slice(data.indexOf(shiftedString));
  var token = originalString + dataRight.slice(dataRight.indexOf("-"), dataRight.indexOf("\n"));
  console.log(token);

});