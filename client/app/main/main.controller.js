'use strict';

angular.module('hashtagsApp')
  .controller('MainCtrl', function ( $scope, $timeout, $location, $http, $window, socket) {
    $scope.awesomeThings = [];
    $scope.empty = true;
    $scope.hashtags =[];
    $scope.data;
    $scope.loading = false;
    $scope.results;
    $scope.accessToken = $location.$$search.access_token;
    console.log($scope.accessToken, 'yooo')

    //select tag
    $scope.options = [
      { label: 'Sort By', value: 0 },
      { label: 'None', value: 1 },
      { label: 'Popular', value: 2 }
    ];
    $scope.correctlySelected = $scope.options[0];


    $scope.timesOut = function() {
        $scope.clicked = false;
    }

    if($scope.awesomeThings.length < 1){
      $scope.empty = false;
    }

    $http.get('/api/things').success(function(awesomeThings) {
      $scope.awesomeThings = awesomeThings;
      socket.syncUpdates('thing', $scope.awesomeThings);
    });
    $scope.randScolding=function(){
      var randProfanity = ['Ew! No.', 'You hug your Momma with those hands???', "Lets keep it PG!", 'Watch it! There are children about!', 'CONFOUNDED!', "Really? Let's try something more appropriate.", "I'm telling!", "Dude! We don't use words like that.", 'Ahh, we meet again.', '@#$%! not cool man, not cool.', 'Act your age, not your shoe size!' ]
      var rand = Math.floor(Math.random() * (randProfanity.length - 0)) + 0;
      console.log(rand)
      $scope.profanity = randProfanity[rand];
    }

    $scope.addToRecent = function(tag) {
      if(typeof tag === 'object'){
        return;
      } else if(tag) {
        $scope.tagName = tag;
      }
      if($scope.tagName === '') {
        return;
      }
      $http.post('/api/things', { name:$scope.tagName });
    };

    $scope.deleteThing = function($event, thing) {
      $http.delete('/api/things/' + thing._id);
      $event.stopPropagation();
      $event.preventDefault();
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });

    $scope.searchTag = function(tag) {
      if($scope.accessToken){
        $scope.error=false;
        if(typeof tag === 'object'){
          $scope.results = false;
          return;
        } else if(tag) {
          $scope.tagName = tag;
        }
        $scope.hashtags =[];

        if($scope.tagName === '') {
          $scope.results = false;
          return;
        }

        $scope.loading = true;
        $http.get("/api/things/search/"+ $scope.tagName).success(function(data) {
          $scope.addToRecent($scope.tagName);
          $scope.data = data;
          $scope.filterResults($scope.data)
          $scope.correctlySelected = $scope.options[0];
          $scope.tagName = '';

        }).error(function(err){
          $scope.error = err.err
          $scope.loading = false;
          $scope.tagName = '';
          $scope.randScolding();
          return;
        })
        $scope.results = $scope.tagName;

      } else {
        $scope.clicked = true;
        var newTime = $timeout($scope.timesOut,10000);
        $scope.tagName = '';
      }
    };

    $scope.filterResults= function(data, t) {
      $scope.hashtags =[];

      if (t === true && data.length < 18) {
          for(var i = data.length-1; i >= 0; i--) {
            $scope.hashtags.push(data[i])
          }
      } else if(t === true) {
        for(var i = data.length-1; i > data.length-19; i--) {
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
