var restify = require('restify');

var wundergroundClient = restify.createJsonClient({ url: 'http://api.wunderground.com' });

function getCurrentWeather(location, callback) {
    var escapedLocation = location.replace(/\W+/, '_');
    wundergroundClient.get(`/api/KEY/conditions/q/${escapedLocation}.json`, (err, req, res, obj) => {
        console.log(obj);
        var observation = obj.current_observation;
        var results = obj.response.results;
        if (observation) {
            callback(`It is ${observation.weather} and ${observation.temp_c} degrees in ${observation.display_location.full}.`);
        } else if (results) {
            callback(`There is more than one '${location}'. Can you be more specific?`);
        } else {
            callback("Couldn't retrieve weather.");
        }
    })
}

module.exports = {
    getCurrentWeather: getCurrentWeather
};

