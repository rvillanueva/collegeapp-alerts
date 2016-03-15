'use strict';

(function() {

class AdminController {
  constructor(User, $http) {
    // Use the User $resource to fetch all users
    this.$http = $http;
    this.users = User.query();
  }

  delete(user) {
    user.$remove();
    this.users.splice(this.users.indexOf(user), 1);
  }
  sendAlerts(){
    this.$http.post('/api/alerts/', this.applicant)
      .then(response => {
        window.alert('Alerts manually triggered. Reminders will still automatically be sent today if they haven\'t already.')
      });
  }
}

angular.module('collegeApp.admin')
  .controller('AdminController', AdminController);

})();
