/**
 * Created by jk on 09/04/15.
 */

var myApp = angular.module('myApp');

myApp.factory('LoggedInUser', function () {
  return { loggedInUser: undefined };
});
