'use strict';

var CronJob = require('cron').CronJob;
var Alert = require('../alert');

var job;

console.log('Cron active.');

// Run job every day at 2pm Eastern

// If you're in a development environment, run it every minute
if (process.env.NODE_ENV == 'development') {
  job = new CronJob('*/30 * * * * *', function() {
    Alert.reminders();
  }, null, false, 'America/New_York');
}

job.start();
