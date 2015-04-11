'use strict';

var view2Module = angular.module('myApp.view2', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider
    .when('/view2', {
      templateUrl: 'view2/view2.html',
      controller: 'View2Ctrl'
    })
    .when('/view2/:progId', {
      templateUrl: function(params){

        return 'view2/view2.html'
      }
      ,
      controller: 'View2Ctrl'
    })
  ;
}]);

view2Module.controller('View2Ctrl', ['$rootScope', '$scope', '$http', '$routeParams', 'filenameService', function($rootScope, $scope, $http, $routeParams, filenameService) {

  var progIdUriSegment = "";

  if ($rootScope.progId !== undefined) {

    progIdUriSegment = "/" + $rootScope.progId;
  }

  //$http.get('http://localhost:3030' + progIdUriSegment)
  $http.get('' + progIdUriSegment)
    .success(function (data, status, headers, config) {
      $scope.files = data.files;

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
      $scope.summary = $scope.getProgrammeSummary();

  }).error(function(data, status, headers, config) {

  });

  filenameService.setUpScope($scope);
}]);

//function fileParser(file) {
//
//  this.getDate = function(){
//
//    var regexFileName = /[a-zA-Z\s]*/;
//
//    var fileDate = getFileInfo(file, regexFileName);
//  }
//
//  function getFileInfo(fileName, regex) {
//
//    var items = fileName.match(regex);
//    var itemInfo = undefined;
//
//    items.forEach(function (item) {
//
//      //console.log("matches:", item);
//
//      itemInfo = item;
//    });
//
//    return itemInfo;
//  }
//}

