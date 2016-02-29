'use strict';

angular.module('collegeApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/alerts/success', {
        templateUrl: 'app/routes/alerts/success/success.html',
        controller: 'AlertsSuccessCtrl'
      });
  });
