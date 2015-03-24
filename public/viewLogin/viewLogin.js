/**
 * Created by jk on 10/03/15.
 */

'use strict';

var loginModule = angular.module('myApp.viewLogin', ['ngRoute', 'ngCookies']);

loginModule.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/login', {
    templateUrl: 'viewLogin/viewLogin.html',
    controller: 'LoginCtrl'
  });
}]);

loginModule.controller('LoginCtrl', ['$scope', '$location', '$window', '$cookies', 'AuthService', '$log', function ($scope, $location, $window, $cookies, AuthService, $log) {
  $scope.credentials = {
    email: '',
    password: ''
  };

  $scope.login = function (credentials) {
    AuthService.login(credentials).then(function (res, err) {
        $cookies.loggedInUser = res.data;

        //NOTE: relocate to app-relative href
        //$location.path('/admin/pages');
        //$location.path('/manageFolders');
        //$location.path('/chooseProgramme');

        //NOTE: relocate to non-app href
        //$window.location.href = 'http://localhost:3030/manageFolders';
        $location.path('/manageFolders');
      },
      function (err) {
        $log.log(err);
      });
  };
}]);
