'use strict';

angular.module('collegeApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'app/routes/landing/landing.html',
        controller: 'LandingCtrl'
      });
  });
