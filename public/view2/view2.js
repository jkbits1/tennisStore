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

view2Module.factory('filenameService', function () {

  //return function (){

  var t1 = "";


  return {

    // NOTE: although both methods work, not sure whether to use this.fn or pass in filenameService as an arg and use filenameService.fn
    setUpScope: function($scope) {

      $scope.getDateAsString = this.getDateAsString;

      $scope.getProgramName = this.getProgramName($scope);

      $scope.getFirstEpisodeDate = this.getFirstEpisodeDate
        //($scope)
      ;
      $scope.getLastEpisodeDate = this.getLastEpisodeDate($scope);

      $scope.getEpisodeCount = this.getEpisodeCount($scope);
    },
    getFileName: function (x) {
      return "123";
    },
    getDateAsString: function (date) {
      var fileDate = new Date(date);
      return fileDate.toDateString();
    },
    //getProgramName: function () {
    //
    //  if ($scope.files === undefined) {
    //    return "";
    //  }
    //
    //  return $scope.files[0].fileName;
    //},
    getProgramName: function ($scope) {

      return function() {

        if ($scope.files === undefined) {
          return "";
        }

        return $scope.files[0].fileName;
      };
    },

    // NOTE: both patterns below work equally well (for all service fns), i) using a closure to allow use of scope, and ii) simply using this, relying on that being scope. I prefer the closure as more readable, possibly future-proof but is perhaps slightly less efficient.
    //getFirstEpisodeDate: function($scope) {
    //
    //  return function() {
    //
    //    if ($scope.files === undefined) {
    //
    //      return "";
    //    }
    //
    //    return new Date($scope.files[0].date).toDateString();
    //  }
    //},
    getFirstEpisodeDate: function() {

        //if ($scope.files === undefined) {
        if (this.files === undefined) {

          return "";
        }

        //return new Date($scope.files[0].date).toDateString();
        return new Date(this.files[0].date).toDateString();
    },

    getLastEpisodeDate: function($scope) {

      return function() {

        if ($scope.files === undefined) {

          return "";
        }

        var lastEpisodeIndex = $scope.files.length - 1;

        return new Date($scope.files[lastEpisodeIndex].date).toDateString();
      }
    },

    getEpisodeCount: function($scope) {

      return function() {
        if ($scope.files === undefined) {

          return 0;
        }

        return $scope.files.length;
      }
    }
  };

  //var t1 = "";
  //return function(x){
  //    return "123";
  //}
  //}

});

view2Module.controller('View2Ctrl', ['$rootScope', '$scope', '$http', '$routeParams', 'filenameService', function($rootScope, $scope, $http, $routeParams, filenameService) {

  var progIdUriSegment = "";

  if ($rootScope.progId !== undefined) {

    progIdUriSegment = "/" + $rootScope.progId;
  }

  $http.get('http://localhost:3030' + progIdUriSegment)
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
      //$scope.fileDate = $scope.files[0].date;

  }).error(function(data, status, headers, config) {

  });

  filenameService.setUpScope($scope);
}]);

function fileParser(file) {

  this.getDate = function(){

    var regexFileName = /[a-zA-Z\s]*/;

    var fileDate = getFileInfo(file, regexFileName);
  }

  function getFileInfo(fileName, regex) {

    var items = fileName.match(regex);
    var itemInfo = undefined;

    items.forEach(function (item) {

      //console.log("matches:", item);

      itemInfo = item;
    });

    return itemInfo;
  }
}

