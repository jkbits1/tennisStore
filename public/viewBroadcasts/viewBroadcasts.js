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

viewBroadcastsModule.controller('ViewBroadcastsCtrl', ['$rootScope', '$scope', '$http', '$cookies', 'filenameService', function($rootScope, $scope, $http, $cookies, filenameService) {

  var progIdUriSegment = "";

  if ($rootScope.progId !== undefined) {
    progIdUriSegment = "/" + $rootScope.progId;
  }
  else if ($cookies.selectedProgramme !== undefined) {
    progIdUriSegment = "/" + $cookies.selectedProgramme;
  }

  //$http.get('http://localhost:3030' + progIdUriSegment)
  $http.get('' + progIdUriSegment)
      .success(function (data, status, headers, config) {
        $scope.files = data.files;

        //var t1a = filenameService.getFileName("1");
        var getFileName = filenameService.getFileName;
        //var getFileName = filenameService;
        var t1a = getFileName("1");

        var monthYears = [];

        $scope.fileDates = $scope.files.map(function (file) {

          var dateWithoutWeekday = $scope.getDateAsString(file.date);
          var dateWithoutWeekdayLetters = dateWithoutWeekday.split('');

          var month = dateWithoutWeekdayLetters.splice(4, 3).join('');
          // remove space
          //dateWithoutWeekdayLetters.splice(0, 1);
          var day = dateWithoutWeekdayLetters.splice(5, 2).join('');
          var year = dateWithoutWeekdayLetters.splice(6, 4).join('');

          var monthInfo = "";

          if (monthYears[year + month] === undefined) {

            monthYears[year + month] = 1;

            //monthInfo = year + "&nbsp;&nbsp;&nbsp;&nbsp;" + month;
            monthInfo = year + "  " + month;
          }
          else {

            monthYears[year + month] += 1;
            //monthInfo = "&nbsp;";
            monthInfo = "";
            month = "";
            year = "";
          }

          return {
            monthYear: monthInfo,
            year: year,
            month: month,
            day: day
          }
        });

        //var parser = new fileParser($scope.files[0].fileName);

        $scope.fileName = $scope.getProgramName();
        //$scope.fileDate = $scope.files[0].date;

      }).error(function(data, status, headers, config) {

      });

    filenameService.setUpScope($scope);

    //$scope.getDateAsString = function(date) {
    //
    //  var fileDate = new Date(date);
    //
    //  return fileDate.toDateString();
    //};
    //
    //$scope.getProgramName = function() {
    //
    //  if ($scope.files === undefined) {
    //
    //    return "";
    //  }
    //
    //  return $scope.files[0].fileName;
    //};
    //
    //$scope.getFirstEpisodeDate = function() {
    //
    //  if ($scope.files === undefined) {
    //
    //    return "";
    //  }
    //
    //  return new Date($scope.files[0].date).toDateString();
    //};
    //
    //$scope.getLastEpisodeDate = function() {
    //
    //  if ($scope.files === undefined) {
    //
    //    return "";
    //  }
    //
    //  var lastEpisodeIndex = $scope.files.length - 1;
    //
    //  return new Date($scope.files[lastEpisodeIndex].date).toDateString();
    //};
    //
    //$scope.getEpisodeCount = function() {
    //
    //  if ($scope.files === undefined) {
    //
    //    return 0;
    //  }
    //
    //  return $scope.files.length;
    //};
  }]);

