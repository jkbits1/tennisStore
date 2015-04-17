/**
 * Created by jk on 17/04/15.
 */

'use strict';

var signupModule = angular.module('myApp.viewSignup', ['ngRoute', 'ngCookies']);

signupModule.config(['$routeProvider', function($routeProvider){
  $routeProvider.when('/signup', {
    templateUrl: 'viewSignup/viewSignup.html',
    controller: 'SignupCtrl'
  });
}]);

signupModule.controller('SignupCtrl', ['$rootScope', '$scope', '$location', '$window', '$cookies', 'AuthService', '$log', 'LoggedInUser', function($rootScope, $scope, $location, $window, $cookies, AuthService, $log, LoggedInUser){
  $scope.credentials = {
    email: '',
    password: ''
  };

  $scope.signup = function (credentials){
    AuthService.signup(credentials).then(function (res, err){
      $cookies.loggedInUser = res.data;
      LoggedInUser.loggedInUser = $cookies.loggedInUser;

      $location.path('/manageFolders');
    },
    function (err){
      $log.log(err);
    });
  }
}]);