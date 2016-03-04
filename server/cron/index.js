'use strict';

var CronJob = require('cron').CronJob;
var fs = require('fs');
var path = require('path');
var Alert = require('../alert');

console.log('Cron active.');

var sendAlerts = function(){
  var directory = path.join(__dirname, '../components/data/reminders.json');
  var today = new Date();
  
  // Get schools by reading reminders.json file
  fs.readFile(directory, 'utf-8', (err, data) => {
    console.log(__dirname)
    if (err) throw err;
    var schools = data;
    var reminders = [];
    for(var i; i < schools.length; i++){
      var school = schools[i];

      // Cycle through deadlines of that school to see if any are for today
      for(var j; j < school.deadlines.length; j++){
        var deadline = school.deadlines[j];
        var reminder;
        // Identify what reminders are due today
        if(deadline.date >= today && deadline.date < today){ // Logic to check if between today and tomorrow or if early reminder
          reminder = {
            satId: school.satId,
            deadlineName: deadline.deadlineName,
            date: deadline.date,
            schoolName: school.schoolName
          };
          reminders.push(reminder);
        }
      }
    }
    // Push the reminders to another service that finds users tracking those schools
    Alerts.reminders(reminders);
  });
}

// Run job every day at 2pm Eastern

new CronJob('0 0 14 * * *', function() {

}, null, true, 'America/New_York');
