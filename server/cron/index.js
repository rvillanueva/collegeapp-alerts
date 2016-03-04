'use strict';

var CronJob = require('cron').CronJob;

console.log('Cron active.');

// Run job every day at 2pm

new CronJob('0 0 14 * * *', function() {
  console.log('You will see this message every second');
}, null, true, 'America/Los_Angeles');
