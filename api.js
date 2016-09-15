let request = require('request');
let config = require('./config.js');


exports.getStations = function (query) {
  return new Promise((resolve, reject) => {
    // request( uri, options, callback );
    request(
      `${config.url}/location.name?input=${query}&accessId=${config.token}&format=json&type=S`,
      {json: true},
      // callback
      (error, response, body) => {
        // if we get an error or the response is not right (not 200),
        // we call reject(), which calls 'func' in .catch(func)
        if (error) return reject(error);
        if (response.statusCode !== 200) return reject(new Error(body));
        // otherwise we call resolve(), which calls 'func' in .then(func)
        resolve(body);
      });
  });
};


exports.getDepartures = function (id) {
  return new Promise((resolve, reject) => {
    // request( uri, options, callback );
    request(
      `${config.url}/departureBoard?id=${id}&accessId=${config.token}&format=json`,
      {json: true},
      // callback
      (error, response, body) => {
        // if we get an error or the response is not right (not 200),
        // we call reject(), which calls 'func' in .catch(func)
        if (error) return reject(error);
        if (response.statusCode !== 200) return reject(new Error(body));
        // otherwise we call resolve(), which calls 'func' in .then(func)
        resolve(body);
      });
  });
};
