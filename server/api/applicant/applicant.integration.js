'use strict';

var app = require('../..');
import request from 'supertest';

var newApplicant;

describe('Applicant API:', function() {

  describe('GET /api/applicants', function() {
    var applicants;

    beforeEach(function(done) {
      request(app)
        .get('/api/applicants')
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicants = res.body;
          done();
        });
    });

    it('should respond with JSON array', function() {
      applicants.should.be.instanceOf(Array);
    });

  });

  describe('POST /api/applicants', function() {
    beforeEach(function(done) {
      request(app)
        .post('/api/applicants')
        .send({
          name: 'New Applicant',
          info: 'This is the brand new applicant!!!'
        })
        .expect(201)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          newApplicant = res.body;
          done();
        });
    });

    it('should respond with the newly created applicant', function() {
      newApplicant.name.should.equal('New Applicant');
      newApplicant.info.should.equal('This is the brand new applicant!!!');
    });

  });

  describe('GET /api/applicants/:id', function() {
    var applicant;

    beforeEach(function(done) {
      request(app)
        .get('/api/applicants/' + newApplicant._id)
        .expect(200)
        .expect('Content-Type', /json/)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          applicant = res.body;
          done();
        });
    });

    afterEach(function() {
      applicant = {};
    });

    it('should respond with the requested applicant', function() {
      applicant.name.should.equal('New Applicant');
      applicant.info.should.equal('This is the brand new applicant!!!');
    });

  });

  describe('PUT /api/applicants/:id', function() {
    var updatedApplicant;

    beforeEach(function(done) {
      request(app)
        .put('/api/applicants/' + newApplicant._id)
        .send({
          name: 'Updated Applicant',
          info: 'This is the updated applicant!!!'
        })
        .expect(200)
        .expect('Content-Type', /json/)
        .end(function(err, res) {
          if (err) {
            return done(err);
          }
          updatedApplicant = res.body;
          done();
        });
    });

    afterEach(function() {
      updatedApplicant = {};
    });

    it('should respond with the updated applicant', function() {
      updatedApplicant.name.should.equal('Updated Applicant');
      updatedApplicant.info.should.equal('This is the updated applicant!!!');
    });

  });

  describe('DELETE /api/applicants/:id', function() {

    it('should respond with 204 on successful removal', function(done) {
      request(app)
        .delete('/api/applicants/' + newApplicant._id)
        .expect(204)
        .end((err, res) => {
          if (err) {
            return done(err);
          }
          done();
        });
    });

    it('should respond with 404 when applicant does not exist', function(done) {
      request(app)
        .delete('/api/applicants/' + newApplicant._id)
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
