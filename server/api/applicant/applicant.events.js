/**
 * Applicant model events
 */

'use strict';

import {EventEmitter} from 'events';
var Applicant = require('./applicant.model');
var ApplicantEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
ApplicantEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Applicant.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    ApplicantEvents.emit(event + ':' + doc._id, doc);
    ApplicantEvents.emit(event, doc);
  }
}

export default ApplicantEvents;
