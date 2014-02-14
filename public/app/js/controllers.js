'use strict';

var graffitiControllers = angular.module('graffitiControllers', []);

graffitiApp.controller('GraffitiListCtrl', ['$scope', 'Graffiti',
  function($scope, Graffiti){
    $http.get('http://localhost:3000/graffiti/geocoded_graffiti').success(function(data) {
     $scope.graffitis = data;
    });
 
    // $scope.graffitis = Graffiti.query();

    $scope.orderProp = 'name';
  }]);

graffitiControllers.controller('GraffitiDetailCtrl', ['$scope', '$routeParams', '$http',
  function($scope, $routeParams, $http) {
    $http.get("graffitis/graffitis-" + $routeParams.graffitiId + '.json').success(function(data) {
      $scope.graffiti = data[0];
      $scope.mainImg = data[0].images[0];
    });

    $scope.setImage = function(imageName) {
      $scope.mainImg = imageName;
    }
  }]);