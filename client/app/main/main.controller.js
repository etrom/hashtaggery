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
    $scope.hashtags =[];
    $scope.data;
    $scope.loading = false;

    $scope.options = [
      { label: 'Sort By', value: 0 },
      { label: 'None', value: 1 },
      { label: 'Popular', value: 2 }
    ];
     $scope.correctlySelected = $scope.options[0];


    if($scope.awesomeThings.length < 1){
      $scope.empty = false;
    }


    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });

    $scope.addSearch = function() {
      if($scope.tagName === '') {
        return;
      }
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
      $scope.loading = true;
      $http.get("/api/things/search/"+ $scope.tagName).success(function(data){
        $scope.data = data;
        $scope.filterResults($scope.data)
        $scope.correctlySelected = $scope.options[0];
      })
      $scope.tagName = '';
    };

    $scope.filterResults= function(data, t) {
      $scope.hashtags =[];

      if (t === true && data.length < 18) {
          for(var i = data.length-1; i >= 0; i--){
            $scope.hashtags.push(data[i])
          }
      } else if(t === true) {
        for(var i = data.length-1; i > data.length-19; i--){
          $scope.hashtags.push(data[i])
        }
      } else if (data.length > 18) {
          for(var i =0; i < 18; i++) {
            $scope.hashtags.push(data[i])
          }
      } else {
        $scope.hashtags = data;
      }

      $scope.loading= false;
    }

    $scope.sortBy = function(val) {
      console.log(val, 'ding')
      if(val === 2) {
        $scope.data.sort(function(a, b){
          return a.media_count-b.media_count
        })
        $scope.filterResults($scope.data, true)
      }
     if(val === 1) {
        $scope.filterResults($scope.data)
      }
      if(val === 0) {
        $scope.filterResults($scope.data)
      }

    }

    $scope.login = function() {

      $window.location.href = "/api/things/authorize_user"
    };



  });
