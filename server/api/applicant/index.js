'use strict';

var express = require('express');
var controller = require('./applicant.controller');

var router = express.Router();

router.post('/', controller.create);
router.post('/sms', controller.sms);

module.exports = router;
