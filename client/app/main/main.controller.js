'use strict';

angular.module('hashtagsApp')
  // .directive('ngLoading', function () {
  //     return {
  //       restrict: 'A',
  //       templateUrl: 'app/scripts/directive/loading.html'
  //     }
  //   })
  .controller('MainCtrl', function ($scope, $location, $http, $window, socket) {
    $scope.awesomeThings = [];
    $scope.empty = true;

    if($scope.awesomeThings.length < 1){
      $scope.empty = false;
    }
    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addSearch = function() {
      $http.post('/api/things', { name:$scope.tagName });
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.searchTag = function() {
      $scope.hashtags =[];
      if($scope.tagName === '') {
        return;
      }
      $http.get("/api/things/search/"+ $scope.tagName).success(function(data){
        console.log(data.media_count, 'before')

       console.log( data.sort(function(a, b){
          return a.media_count-b.media_count
        })
       )
       console.log(data.media_count, 'after')

        // sort by most popular (highest #)
        if(data.length > 18){
          for(var i =0; i < 18; i++){
            console.log(data[i].media_count, 'here i am')
            $scope.hashtags.push(data[i])
          }
        } else {
          $scope.hashtags=data;
        }
      })

      $scope.tagName = '';
    };

    $scope.login = function() {

      $window.location.href = "/api/things/authorize_user"
    };



  });
