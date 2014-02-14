'use strict';

//this used to be in our controllers 
// but now that we have more than one
// controller, it's going in here!

//the empty array argument also now holds
//2 items, these are the modules that the
//app depends on
// ngRoutes - allows us to use angular-route.js
// graffitiControllers - al
var graffitiApp = angular.module('graffitiApp', [
  'ngRoute',
  'graffitiControllers',
  'graffitiFilters',
  'graffitiServices'
]);

graffitiApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/geocoded_graffiti', {
        templateUrl: 'partials/graffiti-list.html',
        controller: 'GraffitiListCtrl'
      }).
      when('/dashboard', {
        templateUrl: 'partials/graffiti-dashboard.html',
        controller: 'GraffitiListCtrl'
      }).
      when('/new', {
        templateUrl: 'partials/graffiti-form.html',
        controller: 'GraffitiListCtrl'
      }).
      when('/graffiti/:graffitiId', {
        templateUrl: 'partials/graffiti-detail.html',
        controller: 'GraffitiDetailCtrl'
      }).
      otherwise({
        redirectTo: '/geocoded_graffiti'
      });
  }]);