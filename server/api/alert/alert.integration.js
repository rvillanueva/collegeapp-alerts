'use strict';

var app = require('../..');
import request from 'supertest';

var newAlert;

describe('Alert API:', function() {

  describe('GET /api/alerts', function() {
    var alerts;

    beforeEach(function(done) {
      request(app)
        .get('/api/alerts')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          alerts = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      alerts.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/alerts', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/alerts')
        .send({
          name: 'New Alert',
          info: 'This is the brand new alert!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newAlert = res.body;
          done();
        });
    });

    it('should respond with the newly created alert', function() {
      newAlert.name.should.equal('New Alert');
      newAlert.info.should.equal('This is the brand new alert!!!');
    });

  });

  describe('GET /api/alerts/:id', function() {
    var alert;

    beforeEach(function(done) {
      request(app)
        .get('/api/alerts/' + newAlert._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          alert = res.body;
          done();
        });
    });

    afterEach(function() {
      alert = {};
    });

    it('should respond with the requested alert', function() {
      alert.name.should.equal('New Alert');
      alert.info.should.equal('This is the brand new alert!!!');
    });

  });

  describe('PUT /api/alerts/:id', function() {
    var updatedAlert;

    beforeEach(function(done) {
      request(app)
        .put('/api/alerts/' + newAlert._id)
        .send({
          name: 'Updated Alert',
          info: 'This is the updated alert!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedAlert = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedAlert = {};
    });

    it('should respond with the updated alert', function() {
      updatedAlert.name.should.equal('Updated Alert');
      updatedAlert.info.should.equal('This is the updated alert!!!');
    });

  });

  describe('DELETE /api/alerts/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/alerts/' + newAlert._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when alert does not exist', function(done) {
      request(app)
        .delete('/api/alerts/' + newAlert._id)
        .expect(404)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

  });

});
