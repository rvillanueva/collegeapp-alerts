'use strict';

// Use local.env.js for environment variables that grunt will set when the server starts locally.
// Use for your api keys, secrets, etc. This file should not be tracked by git.
//
// You will need to set these on the server you deploy to.

module.exports = {
  DOMAIN:           'http://localhost:9000',
  SESSION_SECRET:   'college-secret',

  GOOGLE_ID:        'app-id',
  GOOGLE_SECRET:    'secret',

  TWILIO_PHONE: '',
  TWILIO_ID: '',
  TWILIO_KEY: '',

  CRON: 'inactive',

  INTERNAL_SECRET: 'secret',


  // Control debug level for modules using visionmedia/debug
  DEBUG: ''
};
