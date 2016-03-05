'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ApplicantSchema = new mongoose.Schema({
  phone: {
    type: String,
    unique: true
  },
  created: Date,
  schools: [
    {
      satId: String
    }
  ]
});

export default mongoose.model('Applicant', ApplicantSchema);
