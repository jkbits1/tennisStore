/**
 * Created by jk on 08/04/15.
 */

var myApp = angular.module('myApp');

myApp.directive('adminLogin', [function (){
  return {
    restrict: 'A',
    transclude: true,
    controller: function ($rootScope, $scope, $http, $cookies, LoggedInUser) {

      $scope.loggedInUser = LoggedInUser.loggedInUser;
      $scope.status = LoggedInUser;

      console.log("status:", $scope.status);

      //$http.get('/isLoggedIn')
      //  .success(function (data, status, headers, config) {
      //
      //    if (data.loggedIn === undefined || data.loggedIn !== true) {
      //      //$scope.$apply(function (){
      //      $scope.loggedInUser = false;
      //      $rootScope.loggedInUser = undefined;
      //      delete $cookies["loggedInUser"];
      //      //});
      //      //$location.path('/login');
      //    }
      //  })
      //  .error(function (data, status, headers, config) {
      //
      //    var i = 0;
      //  });


      if ($cookies.loggedInUser != undefined) {
        $scope.loggedInUser = $cookies.loggedInUser;
        //$root.loggedInUser = $cookies.loggedInUser;
        $rootScope.loggedInUser = $cookies.loggedInUser;
        LoggedInUser.loggedInUser = $cookies.loggedInUser;
      }
    },
    templateUrl: 'directives/admin-login.html'
  };
}]);
