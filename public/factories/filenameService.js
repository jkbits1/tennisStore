/**
 * Created by jk on 11/04/15.
 */

var view2Module = angular.module('myApp.view2');

view2Module.factory('filenameService', function () {
  var t1 = "";

  return {

    // NOTE: although both methods work, not sure whether to use this.fn or pass in filenameService as an arg and use filenameService.fn
    setUpScope: function($scope) {

      $scope.getDateAsString = this.getDateAsString;
      $scope.getProgramName = this.getProgramName($scope);

      $scope.getProgrammeSummary = this.getProgrammeSummary($scope);

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
    getProgramName: function ($scope) {

      return function() {
        if ($scope.files === undefined || $scope.files.length === 0) {
          return "";
        }

        return $scope.files[0].fileName;
      };
    },
    getProgrammeSummary: function ($scope) {

      return function () {
        if ($scope.summary === undefined || $scope.summary === 0) {
          return "";
        }

        return $scope.summary;
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
      if (this.files === undefined || this.files.length === 0) {
        return "";
      }

      return new Date(this.files[0].date).toDateString();
    },

    getLastEpisodeDate: function($scope) {

      return function() {
        if ($scope.files === undefined || $scope.files.length === 0) {

          return "";
        }

        var lastEpisodeIndex = $scope.files.length - 1;

        return new Date($scope.files[lastEpisodeIndex].date).toDateString();
      }
    },

    getEpisodeCount: function($scope) {

      return function() {
        if ($scope.files === undefined || $scope.files.length === 0) {

          return 0;
        }

        return $scope.files.length;
      }
    }
  };
});

