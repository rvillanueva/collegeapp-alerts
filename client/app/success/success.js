'use strict';

angular.module('collegeApp')
  .config(function ($routeProvider) {
    $routeProvider
      .when('/success', {
        templateUrl: 'app/success/success.html',
        controller: 'AlertsSuccessCtrl'
      });
  });
