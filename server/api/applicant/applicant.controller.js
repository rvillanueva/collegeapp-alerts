/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/applicants              ->  index
 * POST    /api/applicants              ->  create
 * GET     /api/applicants/:id          ->  show
 * PUT     /api/applicants/:id          ->  update
 * DELETE  /api/applicants/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Applicant = require('./applicant.model');
var twilio = require('twilio')(process.env.TWILIO_ID, process.env.TWILIO_KEY);
var Alert = require('../../alert')

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  console.log('Error ' + statusCode);
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  console.log('Response ' + statusCode);
  return function(entity) {
    if (entity) {
      console.log(statusCode)
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function testHandler(res) {
  return function(entity) {
      res.status(404).end();
      return null;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = _.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Applicants
export function index(req, res) {
  Applicant.findAsync()
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Gets a single Applicant from the DB
export function show(req, res) {
  Applicant.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Creates a new Applicant in the DB
export function create(req, res) {
  // create applicant with phone number, verified false
  Applicant.createAsync(req.body)
    //.then(Alert.test(res))
    .then(Alert.registered(res))
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
}

// Updates an existing Applicant in the DB
export function update(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Applicant.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
}

// Deletes a Applicant from the DB
export function destroy(req, res) {
  Applicant.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}
