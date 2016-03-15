var request = require('request');

var options = {
  method: 'POST',
  uri: process.env.DOMAIN + '/api/alerts/scheduled',
  headers: {
    internal_secret: process.env.INTERNAL_SECRET
  }
}

request(options, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log('Reminders sent.')
  } else {
    console.log('Reminder scheduler error: ' + error);
    console.log(options);
  }
})
