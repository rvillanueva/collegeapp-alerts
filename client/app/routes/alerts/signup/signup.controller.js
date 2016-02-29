'use strict';

angular.module('collegeApp')
  .controller('AlertsSignupCtrl', function ($scope) {
    $scope.applicant = {
      schools: [{
        name: "Tufts University"
      }]
    };
  });
