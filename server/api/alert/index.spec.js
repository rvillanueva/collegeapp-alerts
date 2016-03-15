'use strict';

var proxyquire = require('proxyquire').noPreserveCache();

var alertCtrlStub = {
  index: 'alertCtrl.index',
  show: 'alertCtrl.show',
  create: 'alertCtrl.create',
  update: 'alertCtrl.update',
  destroy: 'alertCtrl.destroy'
};

var routerStub = {
  get: sinon.spy(),
  put: sinon.spy(),
  patch: sinon.spy(),
  post: sinon.spy(),
  delete: sinon.spy()
};

// require the index with our stubbed out modules
var alertIndex = proxyquire('./index.js', {
  'express': {
    Router: function() {
      return routerStub;
    }
  },
  './alert.controller': alertCtrlStub
});

describe('Alert API Router:', function() {

  it('should return an express router instance', function() {
    alertIndex.should.equal(routerStub);
  });

  describe('GET /api/alerts', function() {

    it('should route to alert.controller.index', function() {
      routerStub.get
        .withArgs('/', 'alertCtrl.index')
        .should.have.been.calledOnce;
    });

  });

  describe('GET /api/alerts/:id', function() {

    it('should route to alert.controller.show', function() {
      routerStub.get
        .withArgs('/:id', 'alertCtrl.show')
        .should.have.been.calledOnce;
    });

  });

  describe('POST /api/alerts', function() {

    it('should route to alert.controller.create', function() {
      routerStub.post
        .withArgs('/', 'alertCtrl.create')
        .should.have.been.calledOnce;
    });

  });

  describe('PUT /api/alerts/:id', function() {

    it('should route to alert.controller.update', function() {
      routerStub.put
        .withArgs('/:id', 'alertCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('PATCH /api/alerts/:id', function() {

    it('should route to alert.controller.update', function() {
      routerStub.patch
        .withArgs('/:id', 'alertCtrl.update')
        .should.have.been.calledOnce;
    });

  });

  describe('DELETE /api/alerts/:id', function() {

    it('should route to alert.controller.destroy', function() {
      routerStub.delete
        .withArgs('/:id', 'alertCtrl.destroy')
        .should.have.been.calledOnce;
    });

  });

});
