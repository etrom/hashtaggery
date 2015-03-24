'use strict';

angular.module('hashtagsApp')
  .controller('MainCtrl', function ($scope, $location, $http, $window, socket) {
    $scope.awesomeThings = [];
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.searchTag = function() {
      if($scope.tagName === '') {
        return;
      }
      $http.get("/api/things/search/"+ $scope.tagName).success(function(data){
        console.log(data, 'data')
      })
      $scope.tagName = '';
    };

    $scope.login = function() {

      $window.location.href = "/api/things/authorize_user"
    };



  });
