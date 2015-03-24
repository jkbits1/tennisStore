/**
 * Created by jk on 17/03/15.
 */

'use strict';

var manageModule = angular.module('myApp.viewManageFolders', ['ngRoute']);

manageModule.config(['$routeProvider', function ($routeProvider) {
  $routeProvider.when('/manageFolders', {
    templateUrl: function (params){
      return 'viewManageFolders/viewManageFolders.html';
    },
    controller: 'manageFoldersCtrl'
  })
}]);

manageModule.controller('manageFoldersCtrl', ['$rootScope', '$scope', '$http', function ($rootScope, $scope, $http){

  $scope.folders = []; //[{name: "f1"}, {name: "f2"}];

  $scope.folderInfo = {
    id: '',
    name: '',
    path: ''
  };

  //$http.get('http://localhost:3030/foldersDb')
  $http.get('/foldersDb')
    .success(function (data, status, headers, config) {
      $scope.folders = data;
    })
    .error(function (data, status, headers, config) {

    });

  $scope.addFolder = function (folderInfo) {
    //$http.post('http://localhost:3030/addPath', folderInfo)
    $http.post('/addPath', folderInfo)
      .success(function (data, status, headers, config) {

    })
      .error(function (data, status, headers, config){});
  };
}]);