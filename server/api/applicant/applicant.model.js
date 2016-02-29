'use strict';

var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var ApplicantSchema = new mongoose.Schema({
  phone: String,
  created: Date,
  alerts: [
    {
      idType: String,
      id: String
    }
  ]
});

export default mongoose.model('Applicant', ApplicantSchema);
