'use strict';

var Applicant = require('../api/applicant/applicant.model');
var Promise = require('bluebird');
var twilio = require('twilio')(process.env.TWILIO_ID, process.env.TWILIO_KEY);
var schools = require('../components/data/reminders.json');
var moment = require('moment')

function sendAlerts() {
  var today = new Date();
  var reminders = [];
  for (var i = 0; i < schools.length; i++) {
    var school = schools[i];
    /// Cycle through deadlines of that school to see if any are for today
    for (var j = 0; j < school.deadlines.length; j++) {
      var deadline = school.deadlines[j];
      var date = new Date(deadline.date);
      date.setHours(12);
      console.log(date);
      // Identify what reminders are due today
      var reminder = {
        satId: school.satId,
        deadlineName: deadline.deadlineName,
        date: deadline.date,
        schoolName: school.schoolName
      };
      if (
        moment(date).subtract(1, 'days').isAfter(moment().startOf('day')) &&
        moment(date).subtract(1, 'days').isBefore(moment().endOf('day'))
      ){
        reminder.away = 'tomorrow';
        reminders.push(reminder);
        console.log(reminder);
      } else if (
        moment(date).subtract(3, 'days').isAfter(moment().startOf('day')) &&
        moment(date).subtract(3, 'days').isBefore(moment().endOf('day'))
      ) {
        reminder.away = 'in three days';
        reminders.push(reminder);
        console.log(reminder);
      } else if (
        moment(date).subtract(7, 'days').isAfter(moment().startOf('day')) &&
        moment(date).subtract(7, 'days').isBefore(moment().endOf('day'))
      ) {
        reminder.away = 'in a week';
        reminders.push(reminder);
        console.log(reminder);
      }
    }
  }
  // Push the reminders to another service that finds users tracking those schools

  sendReminders(reminders);


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
      console.log('Applicants:');
      console.log(applicants);
      if(applicants && applicants.length > 0){
        for (var i = 0; i < applicants.length; i++) {
          checkApplicant(applicants[i], function(theirReminders, applicant){
            if(theirReminders.length > 0){
              createMessage(theirReminders, applicant)
            }
            if(i == applicants.length - 1){
              console.log('Reminders sent!')
              return true;
            }
          });
        }
      } else {
        console.log('No applicants registered.')
        return false;
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
    message += reminder.away;
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
