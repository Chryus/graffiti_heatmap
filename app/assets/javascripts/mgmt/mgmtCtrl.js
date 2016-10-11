angular.module('graffitiApp')
.controller('MgmtCtrl', [
  '$scope',
  'graffiti',
  function($scope, graffiti){

    $scope.setGoogleImageDates = function() {
      debugger
      graffiti.setGoogleImageDates()
    };

    $scope.sendCaptureDatesToDB = function() {
      graffiti.sendCaptureDatesToDB()
    };

  }])