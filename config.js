// Base url
exports.url = 'http://demo.hafas.de/openapi/vbb-proxy';

// Access token
var token = ''; // <-- Add token here!
exports.getToken = function () {
  // Complain if the token wasn't entered
  if (!token) {
    throw new Error('Get an access token first');
  }
  return token;
};
