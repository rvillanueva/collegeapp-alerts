'use strict';

angular.module('collegeApp.auth', [
  'collegeApp.constants',
  'collegeApp.util',
  'ngCookies',
  'ngRoute'
])
  .config(function($httpProvider) {
    $httpProvider.interceptors.push('authInterceptor');
  });
