'use strict';

var CronJob = require('cron').CronJob;
var fs = require('fs');
var path = require('path');
var Alert = require('../alert');

console.log('Cron active.');

function sendAlerts() {
  var directory = path.join(__dirname, '../components/data/reminders.json');
  var today = new Date();

  console.log('Running reminders.')
  // Get schools by reading reminders.json file
  fs.readFile(directory, 'utf-8', (err, data) => {
    console.log(__dirname)
    if (err) throw err;
    var schools = JSON.parse(data);
    var reminders = [];
    console.log(schools)
    for(var i = 0; i < schools.length; i++){
      var school = schools[i];
      // Cycle through deadlines of that school to see if any are for today
      for(var j = 0; j < school.deadlines.length; j++){
        var deadline = school.deadlines[j];
        // Identify what reminders are due today
        if((deadline.date >= today && deadline.date < today) || process.env.NODE_ENV == 'development'){ // Logic to check if between today and tomorrow or if early reminder
          var reminder = {
            satId: school.satId,
            deadlineName: deadline.deadlineName,
            date: deadline.date,
            schoolName: school.schoolName
          };
          reminders.push(reminder);
          console.log(reminder);
        }
      }
    }
    console.log('Reminders:');
    console.log(reminders);*/

    // Push the reminders to another service that finds users tracking those schools
    //Alert.reminders(reminders);
  });
}

// Run job every day at 2pm Eastern

new CronJob('0 0 14 * * *', function() {
  sendAlerts();
}, null, true, 'America/New_York');


// If you're in a development environment, run it every minute
if(process.env.NODE_ENV == 'development'){
  new CronJob('*/15 * * * * *', function() {
    sendAlerts();
  }, null, true, 'America/New_York');
}
