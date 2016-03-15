/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/alerts              ->  index
 * POST    /api/alerts              ->  create
 * GET     /api/alerts/:id          ->  show
 * PUT     /api/alerts/:id          ->  update
 * DELETE  /api/alerts/:id          ->  destroy
 */

'use strict';

import _ from 'lodash';
var Alert = require('../../alert');

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
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

// Creates a new Alert in the DB
export function send(req, res) {
  Alert.reminders();
  res.status(200).end();
}
