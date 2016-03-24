'use strict';

(function() {

class MainController {

  constructor($http, $scope, $window, $location) {
    this.$http = $http;
    this.$window = $window;
    this.$location = $location;
    this.applicant = {
      schools: []
    };

    $http.get('assets/data/reminders.json').then(response => {
      this.schools = response.data;
      console.log(this.schools);
    });

  }

  addSchool(school) {
    if (school) {
      this.applicant.schools.push(school)
      console.log(school)
      this.addedSchool = null;
    }
  }

  addSchool($item, $model, $label) {
    var matched = false;
    for(var i = 0; i < this.applicant.schools.length; i++){
      if(this.applicant.schools[i].satId == $item.satId){
        matched = true;
      }
    }
    if(!matched){
      var added = {
        satId: $item.satId,
        schoolName: $item.schoolName,
        deadlines: $item.deadlines
      }
      this.applicant.schools.push(added);
    } else {
      window.alert('School has already been added.')
    }
    this.addedSchool = '';
  }

  submit() {
    if(this.applicant.schools.length == 0){
      window.alert('Please add a school to your reminders.')
      return null;
    }
    var posted = angular.copy(this.applicant);
    angular.forEach(posted.schools, function(school, index){
      delete school.deadlines;
    })
    this.$http.post('/api/applicants/', posted)
      .then(response => {
        this.$location.url('/success');
      })
      .catch(err => {
        window.alert('ERROR: ' + err);
      });
    console.log(this.applicant);
  }
}

angular.module('collegeApp')
  .controller('MainController', MainController);

})();
