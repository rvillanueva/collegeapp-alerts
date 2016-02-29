'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var applicantCtrlStub = {
  index: 'applicantCtrl.index',
  show: 'applicantCtrl.show',
  create: 'applicantCtrl.create',
  update: 'applicantCtrl.update',
  destroy: 'applicantCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var applicantIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './applicant.controller': applicantCtrlStub
});

describe('Applicant API Router:', function() {

  it('should return an express router instance', function() {
    applicantIndex.should.equal(routerStub);
  });

  describe('GET /api/applicants', function() {

    it('should route to applicant.controller.index', function() {
      routerStub.get
        .withArgs('/', 'applicantCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/applicants/:id', function() {

    it('should route to applicant.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'applicantCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/applicants', function() {

    it('should route to applicant.controller.create', function() {
      routerStub.post
        .withArgs('/', 'applicantCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/applicants/:id', function() {

    it('should route to applicant.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'applicantCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/applicants/:id', function() {

    it('should route to applicant.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'applicantCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/applicants/:id', function() {

    it('should route to applicant.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'applicantCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
