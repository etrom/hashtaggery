'use strict';

/**
 * @ngdoc directive
 * @name hashtagsApp.directive:loading
 * @description
 * # loading
 */
angular.module('hashtagsApp')

.directive('loading', ['$interval','$timeout', function($interval, $timeout) {
   return {
        templateUrl: 'app/scripts/directives/loading.html',
        restrict: 'E',
        scope: true,
        link: function (scope, elem, attrs) {

            scope.loadingStuff = function() {
                var loadingArray = ['let me think',
                'firing up the hamster',
                'beaming hashtags to your screen',
                'eating ice cream, oh wait!',
                'syncing hashtaggery',
                "it's not hard",
                'fabricating hashtags',
                "hmm...this is a hard one",
                'locating gigapixels',
                'combing hairy data',
                '#pieceofcake',
                'okay I can do this'];
                var rand = Math.floor(Math.random() * (loadingArray.length - 0)) + 0;
                return loadingArray[rand];
            }

            scope.fun = function() {
                debugger;
                scope.loadingMess = scope.loadingStuff()
            }
            scope.fun();
            var newTime = $interval(scope.fun, 3500);
        }
    };
}]);