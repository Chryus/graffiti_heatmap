angular.module('graffitiApp')
.controller('MgmtCtrl', [
  '$scope',
  'graffiti',
  function($scope, graffiti){

    $scope.setStreetviewCaptureDates = function() {
      graffiti.setStreetviewCaptureDates()
    };

    $scope.compareCaptureDatesWithGraffitiDates = function() {
      graffiti.compareCaptureDatesWithGraffitiDates()
    };

  }])