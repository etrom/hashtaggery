'use strict';

/**
 * @ngdoc directive
 * @name hashtagsApp.directive:loading
 * @description
 * # loading
 */
angular.module('hashtagsApp')

.directive('loading', ['$timeout', '$interval', function($interval, $timeout) {
   return {
        templateUrl: 'app/scripts/directives/loading.html',
        restrict: 'E',
        scope: true,
        link: function (scope, elem, attrs) {

            scope.loadingStuff = function() {
                debugger;
                var loadingArray = ['maybe try something...more specific','counting hashtags', "hmm...this is a hard one",'these should be good','okay I can do this'];
                var rand = Math.floor(Math.random() * (loadingArray.length - 0)) + 0;
                scope.loadingMess = loadingArray[rand];
                return scope.loadingMess;
            }
            // // scope.loadingStuff();

            var newTime = $interval( scope.loadingStuff, 1000);





            }
    };
}]);