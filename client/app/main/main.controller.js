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
        debugger;
        for(var i = data.length-1; i > data.length-19; i--){
          $scope.hashtags.push(data[i])
        }
      } else if (data.length > 18) {
          for(var i =0; i < 18; i++) {
            $scope.hashtags.push(data[i])
          }
          $scope.sortBy('none');
      } else {
        $scope.hashtags = data;
        $scope.sortBy('none');
      }

      $scope.loading= false;
    }

    $scope.sortBy = function(keyword) {
      console.log(keyword, 'ding')
      if(keyword === 'popular') {
          $scope.data.sort(function(a, b){
            return a.media_count-b.media_count
          })

      $scope.filterResults($scope.data, true)


      }
      else if(keyword === 'random') {
        console.log('changing to random')
        debugger;
        $scope.filterResults($scope.data)
      } else if(keyword === 'none') {
        console.log('changing to none')
        debugger;
        $scope.value ='none';
      }

    }

    $scope.login = function() {

      $window.location.href = "/api/things/authorize_user"
    };



  });
