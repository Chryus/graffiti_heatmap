'use strict';

var graffitiApp = angular.module('graffitiApp', [
  'ngRoute',
  'graffitiControllers',
  'graffitiFilters',
  'graffitiServices'
]);

graffitiApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/graffiti', {
        templateUrl: 'partials/graffiti-list.html',
        controller: 'GraffitiListCtrl'
      }).
      otherwise({
        redirectTo: '/graffiti'
      });
  }]);