'use strict';

var express = require('express');
var controller = require('./alert.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.post('/', auth.hasRole('admin'), controller.send);
router.post('/scheduled', auth.internal(), controller.send);

module.exports = router;
