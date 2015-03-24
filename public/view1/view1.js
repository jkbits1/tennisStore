'use strict';

angular.module('myApp.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', ['$scope', '$http', function($scope, $http) {

    var req = $http.get('http://localhost:3000');

    req.success(function (data) {

      $scope.files = data.fileEntries;
    });

    req.error(function (data, status, headers, config) {

      console.log(data);
      console.log(headers);
    });

    $scope.notes = [
      {
        id: 1,
        'item': 'one',
        info: 'first item',
        players: ['fed', 'djok']
      },
      {
        id: 2,
        'item': 'two',
        info: 'second item',
        players: ['ndl', 'ptro']
      },
      {
        id: 3,
        'item': 'three',
        info: 'third item',
        players: ['tson', 'frer']
      }
    ];

    $scope.addPlayer = function(player){

      $scope.notes[1].players.push(player);
    }

    $scope.addPlayer2 = function(noteItem, player){

      $scope.notes[noteItem-1].players.push(player);
    }

    $scope.postNote = function() {

      var filesInfo = {
        folderName: "test",
        notes:      $scope.notes
      };

      var post = $http.post('http://localhost:3000/note',
//        {note: 'note1'}
        filesInfo
      );

      post.success(function (data, status, headers, config) {

        console.log(data + ": " + status);
      });

      post.error(function (data, status, headers, config) {

        console.log(data + ": " + status);
      });
    };
  }]);