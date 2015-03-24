/**
 * Created by jk on 16/01/15.
 */

'use strict';

var chooseModule = angular.module('myApp.viewChooseProgramme', ['ngRoute', 'ngCookies']);

chooseModule.config(['$routeProvider', function ($routeProvider) {

  $routeProvider.when('/chooseProgramme', {

    // NOTE: using a fn rather than a string to look
    //       at params for learning purposes.
    templateUrl: function(params){

      return 'viewChooseProgramme/viewChooseProgramme.html';
    }
    //templateUrl: 'viewChooseProgramme/viewChooseProgramme.html'
    ,
    controller: 'chooseProgrammeCtrl'
  });

}]);

chooseModule.controller('chooseProgrammeCtrl', ['$rootScope', '$scope', '$http', '$cookies', function ($rootScope, $scope, $http, $cookies){

  $scope.changeProgramme = function() {

    $rootScope.progId          = $scope.selectedProgramme.id;
    $cookies.selectedProgramme = $rootScope.progId;
  };

  //$http.get('http://localhost:3030/folders')
  $http.get('http://localhost:3030/foldersDb')
    .success(function (data, status, headers, config) {

      //$scope.paths = data.paths;
      $scope.paths = data;

      if ($rootScope.progId !== undefined) {

        $scope.paths.forEach(function (path) {
          if (path.id === $rootScope.progId) {

            $scope.selectedProgramme = path;
          }
        });
      }
      else if ($cookies.selectedProgramme !== undefined) {

        $scope.paths.forEach(function (path) {
          if (path.id === +($cookies.selectedProgramme)) {

            $scope.selectedProgramme = path;
          }
        });
      }
    }).error(function(data, status, headers, config) {

      console.error("no items returned");
    });
}]);
