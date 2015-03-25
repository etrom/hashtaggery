'use strict';

/**
 * @ngdoc directive
 * @name hashtagsApp.directive:loading
 * @description
 * # loading
 */
angular.module('hashtagsApp')
  .directive('loading', function () {
    return {
      templateUrl: 'app/scripts/directives/loading.html',
      restrict: 'E'
      // link: function postLink(scope, element, attrs) {
      //   element.text('this is the loading directive');
      // }
    };
  });
