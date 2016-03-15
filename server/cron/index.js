'use strict';



// Run job every day at 2pm Eastern
if(process.env.CRON == 'active'){

  var CronJob = require('cron').CronJob;
  var Alert = require('../alert');

  var job;

  if (process.env.NODE_ENV == 'production' ) {
    job = new CronJob('0 0 14 * * *', function() {
      Alert.reminders();
    }, null, false, 'America/New_York');
  }

  // If you're in a development environment, run it every minute
  if (process.env.NODE_ENV == 'development') {
    job = new CronJob('0 * * * * *', function() {
      Alert.reminders();
    }, null, false, 'America/New_York');
  }

  job.start();
  console.log('Cron active.');
}
