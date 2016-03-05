'use strict';

var Applicant = require('../api/applicant/applicant.model');
var Promise = require('bluebird');
var twilio = require('twilio')(process.env.TWILIO_ID, process.env.TWILIO_KEY);

function sendReminders(req) {
  console.log(req);
  var reminders = req;
  // - Get all users
  // - Filter for users with schools that have alerts
  // - For each user, compile aggregated reminder
  // - Send each user a reminder
  Applicant.findAsync()
    .then(function(res) {
      console.log('Applicants:')
      console.log(res)
      var applicants = res;
      for (var i = 0; i < applicants.length; i++) {
        var applicant = applicants[i];
        console.log(applicant);
        var theirReminders = [];
        for (var j = 0; j < applicant.schools.length; j++) {
          var school = applicants.schools[j];
          for (var k = 0; k < reminders.length; k++) {
            var reminder = reminders[k];
            if (reminder.satId == school.satId) {
              theirReminders.push(reminder);
            }
          }
        }
        // Concatenate reminders and turn into single message;
        createMessage(theirReminders, applicant);
      }
    })


  function createMessage(reminders, applicant) {
    var message;
    message += 'Hello! We wanted to remind you about the following deadlines: \n'
    for (var j = 0; j < theirReminders.length; j++) {
      var reminder = theirReminders[j];
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
    }).then(function(err, responseData) {
      console.log(responseData);
    }).catch(function(err) {
      console.log('ERROR: ' + err.message);
    });
    // Need to add error handler
  }

  return true;
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
  sendReminders(req);
}

export function test(req, res) {
  return false;
}
