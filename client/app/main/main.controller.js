'use strict';

(function() {

class MainController {

  constructor($http, $scope, socket) {
    this.$http = $http;
    this.applicant = {
      schools: []
    };

    /*$http.get('/api/things').then(response => {
      this.awesomeThings = response.data;
      socket.syncUpdates('thing', this.awesomeThings);
    });*/

    $http.get('assets/data/reminders.json').then(response => {
      this.schools = response.data;
      console.log(this.schools);
    });

    /*$scope.$on('$destroy', function() {
      socket.unsyncUpdates('thing');
    });*/
  }

  addSchool(school) {
    if (school) {
      this.applicant.schools.push(school)
      console.log(school)
      this.addedSchool = null;
    }
  }

  deleteThing(thing) {
    this.$http.delete('/api/things/' + thing._id);
  }

  logging(thing) {
    console.log(thing);
    console.log(this.addedSchool)
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
        schoolName: $item.schoolName
      }
      this.applicant.schools.push(added);
    } else {
      window.alert('School has already been added.')
    }
    this.addedSchool = '';
  }

  submit() {
    this.$http.post('/api/applicants/', this.applicant);
    console.log(this.applicant);
  }
}

angular.module('collegeApp')
  .controller('MainController', MainController);

})();
