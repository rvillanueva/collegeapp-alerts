'use strict';

var Applicant = require('../api/applicant/applicant.model');
var Promise = require('bluebird');
var twilio = require('twilio')(process.env.TWILIO_ID, process.env.TWILIO_KEY);
var schools = require('../components/data/reminders.json');

function sendAlerts() {
  var today = new Date();
  var reminders = [];
  for (var i = 0; i < schools.length; i++) {
    var school = schools[i];
    /// Cycle through deadlines of that school to see if any are for today
    for (var j = 0; j < school.deadlines.length; j++) {
      var deadline = school.deadlines[j];
      // Identify what reminders are due today
      if ((deadline.date >= today && deadline.date < today) || process.env.NODE_ENV == 'development') { // Logic to check if between today and tomorrow or if early reminder
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
    // Push the reminders to another service that finds users tracking those schools
    sendReminders(reminders);
  }

}

function sendReminders(reminders) {
  // - Get all users
  // - Filter for users with schools that have alerts
  // - For each user, compile aggregated reminder
  // - Send each user a reminder

  function checkSchool(school, callback){
    var returned = [];
    for (var k = 0; k < reminders.length; k++) {
      var reminder = reminders[k];
      if (reminder.satId == school.satId) {
        returned.push(reminder);
      }
    }
    callback(returned);
  }

  function checkApplicant(applicant, callback){
    var theirReminders = [];
    for (var j = 0; j < applicant.schools.length; j++) {
      var school = applicant.schools[j];
      checkSchool(school, function(returned){
        theirReminders = theirReminders.concat(returned)
      })
    }

    console.log('done checking...')
    callback(theirReminders, applicant);

  }

  Applicant.findAsync()
    .then(function(applicants) {
      console.log('Applicants:')
      for (var i = 0; i < applicants.length; i++) {
        checkApplicant(applicants[i], function(theirReminders, applicant){
          if(theirReminders.length > 0){
            createMessage(theirReminders, applicant)
          }
        });
      }
    }).catch(function(e){
      console.log(e);
    })
}

function createMessage(reminders, applicant) {
  var message = '';
  message += 'Hello! We wanted to remind you about the following deadlines: \n'
  for (var j = 0; j < reminders.length; j++) {
    var reminder = reminders[j];
    addLine(reminder);
  }

  function addLine(reminder){
    message+="\n"
    message += reminder.schoolName;
    message += '\'s ';
    message += reminder.deadlineName;
    message += ', due ';
    message += 'today';
  }


  console.log('MESSAGE: ' + message)

  var notify = Promise.promisifyAll(twilio.sendMessage);

  notify({
    to: applicant.phone,
    from: process.env.TWILIO_PHONE,
    body: message
  }).then(function(responseData) {
    console.log(responseData);
  }).catch(function(err) {
    console.log('ERROR: ' + err.message);
  });
}


export function registered(req, res) {
  return function(entity) {
    return new Promise(function(resolve, reject) {
      if (!entity.schools || entity.schools.length == 0) {
        res.status(400).send('No schools attached to applicant.');
        resolve(null);
      }

      var responseString = 'You are now signed up to receive admission deadline alerts for ' + entity.schools.length + ' school'
      if (entity.schools.length > 1) {
        responseString += 's';
      }
      responseString += '. If you did not register, text STOP to stop all alerts.';

      var notify = Promise.promisifyAll(twilio.sendMessage);

      notify({
        to: entity.phone,
        from: process.env.TWILIO_PHONE,
        body: responseString
      }).then(function(err, responseData) {
        console.log(responseData);
        resolve(entity);
      }).catch(function(err) {
        res.status(err.status).send(err.message);
        resolve(null);
      });

    })
  }
}

export function reminders(req, res) {
  console.log('Sending reminder alerts...')
  setTimeout(function(){
    sendAlerts();
  }, 5000)
}
