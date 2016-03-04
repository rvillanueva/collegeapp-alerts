'use strict';

var express = require('express');
var controller = require('./applicant.controller');
import * as auth from '../../auth/auth.service';

var router = express.Router();

router.post('/', controller.create);

router.get('/', auth.hasRole('admin'), controller.index);
router.get('/:id', auth.hasRole('admin'), controller.show);
router.put('/:id', auth.hasRole('admin'), controller.update);
router.patch('/:id', auth.hasRole('admin'), controller.update);
router.delete('/:id', auth.hasRole('admin'), controller.destroy);

module.exports = router;
