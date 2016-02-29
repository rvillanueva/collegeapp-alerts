'use strict';

angular.module('collegeApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/alerts/signup', {
        templateUrl: 'app/routes/alerts/signup/signup.html',
        controller: 'AlertsSignupCtrl'
      });
  })
  .config(function ($routeProvider) {
    $routeProvider
      .when('/alerts/signup/:referralId', {
        templateUrl: 'app/routes/alerts/signup/signup.html',
        controller: 'AlertsSignupCtrl'
      });
  });
