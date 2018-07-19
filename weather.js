// Example to run this file // units=imperial locationId=5045360 appId='14e3df96753ec1ac143f5e11dbd7a196' requestFrequency=100000 node server.js

// App parameters
var apiParams = {
  units: process.env.units || 'imperial',
  locationId: process.env.locationId || '5045360',
  appId: process.env.appId || '14e3df96753ec1ac143f5e11dbd7a196', // User API ID
  requestFrequency: process.env.requestFrequency,
}

// Run get weather once the script starts
setImmediate(getWeather);

// Run get weather each specified amount
setInterval(getWeather, apiParams.requestFrequency || 900000);

function getWeather() {
  var http = require('http');
  var str = '';

  var options = {
    host: 'api.openweathermap.org',
    path: '/data/2.5/weather?units='+apiParams.units+'&id='+apiParams.locationId+'&APPID='+apiParams.appId,
  };

  var callback = function(response) {
    // Continuously update stream with data
    response.on('data', function(d) {
      // Data reception is done, do whatever with it!
      var parsed = JSON.parse(d),
          clouds = parsed.clouds.all,
          description = parsed.weather[0].main,
          icon = getWeatherIcon(parsed.weather[0].icon),
          wind = Math.round(parsed.wind.speed),
          temp = Math.round(parsed.main.temp),
          visibility = clearityIcon(parsed.clouds.all);
      str += icon+' '+temp+'°, '+description+', '+kiteCheck(wind)+' '+wind+', '+visibility+' '+clouds;
    });

    response.on('end', function() {
      console.log(str);
    }); 
  };
  var weather = http.request(options, callback).end();
  weather;
}

// Get main weather icon
function getWeatherIcon(id) {
  switch(id) {
    case '01d': case '01n':
      return '☀️';
    case '02d': case '02n':
      return '🌤';
    case '03d': case '03n':
      return '🌥️';
    case '04d': case '04n':
      return '☁';
    case '09d': case '09n':
      return '🌧';
    case '10d': case '10n':
      return '🌦';
    case '11d': case '11n':
      return '🌩';
    case '13d': case '13n':
      return '❄';
    case '50d': case '50n':
      return '🌁';
    default:
      return '';
  }
}

// Get icon for visibility/ clearity
function clearityIcon(num) {
  switch (num) {
    case num > 75:
      return '☁';
    case num <= 7: case num >= 50:
      return '🌥';
    case num <= 49: case num >= 25:
      return '🌤';
    case num < 25:
      return '☀️';
    default:
      return '☀️';
  }
}

// Are we able to fly a kite?
function kiteCheck(wind) {
  if (wind >= 15) {
    return '🎏';
  } else {
    return '☴';
  }
  return;
}
