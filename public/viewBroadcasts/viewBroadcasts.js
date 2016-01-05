/**
 * Created by jk on 08/01/15.
 */

'use strict';

var viewBroadcastsModule =

angular.module('myApp.viewBroadcasts', ['ngRoute'])

  .config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/viewBroadcasts', {
        templateUrl: 'viewBroadcasts/viewBroadcasts.html',
        controller: 'ViewBroadcastsCtrl'
      })
      .when('/viewBroadcasts/:progId', {
        templateUrl: function(params){

          return 'viewBroadcasts/viewBroadcasts.html';
        },
        controller: 'ViewBroadcastsCtrl'
      });
  }]);

// revised to use factory call - maybe Angular upgrade has renamed calls
//app.service("filenameService", function () {
//
//  var t1 = "";
//  return {
//    getFileName: function(x){
//      return "123";
//    }
//  }
//});

viewBroadcastsModule.controller('ViewBroadcastsCtrl', ['$rootScope', '$scope', '$http', '$cookies', '$routeParams', 'filenameService', function($rootScope, $scope, $http, $cookies, $routeParams, filenameService) {

  var progIdUriSegment = "/episodesInfo/";
  var progDetailsUriSegment = "/progDetails/";
  var episodeDetailsUriSegment = "/episodeDetails/";

  var progId = "";

  if ($routeParams.progId !== undefined) {
    progId = $routeParams.progId;
  }
  else if ($rootScope.progId !== undefined) {
    progId = $rootScope.progId;
  }
  else if ($cookies.selectedProgramme !== undefined) {
    progId = $cookies.selectedProgramme;
  }

  progIdUriSegment          += progId;
  progDetailsUriSegment     += progId;
  episodeDetailsUriSegment  += progId;

  $http.get(progDetailsUriSegment)
    .success(function (data, status, headers, config) {
      console.log(data);
      //if (data[0] !== undefined || data.length !== 0)   {
      if (data[0] !== undefined)   {
        $scope.summary = data[0].summary;
      }
    })
    .error(function (data, status, headers, config){

    });


  //$http.get('http://localhost:3030' + progIdUriSegment)
  $http.get('' + progIdUriSegment)
      .success(function (data, status, headers, config) {

        if (data.files !== undefined) {
          $scope.files = data.files;
        }
        else {
          $scope.files = [];
        }

        $scope.fileDates = filenameService.getFileDates($scope.files);

        //var parser = new fileParser($scope.files[0].fileName);

        //$scope.fileName = $scope.getProgramName();
        //$scope.fileDate = $scope.files[0].date;
      }).error(function(data, status, headers, config) {

      });

  $http.get(episodeDetailsUriSegment)
    .success(function (data, status, headers, config) {
      if (data !== undefined) {
        $scope.episodeDetailsDb = data;
      }
      else {
        $scope.episodeDetailsDb = [];
      }

      $scope.episodeDetails = $scope.episodeDetailsDb.map(function (val) {
        var viewableDate = new Date(val.date).toDateString();

        return {
          date: viewableDate
        }
      });
    })
    .error(function (data, status, headers, config) {

    });

    filenameService.setUpScope($scope);
  }]);

