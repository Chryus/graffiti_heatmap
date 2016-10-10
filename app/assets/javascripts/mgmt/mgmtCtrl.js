angular.module('graffitiApp')
.controller('TestCtrl', [
  '$scope',
  'graffiti',
  function($scope, graffiti){
    console.log("ADMIN")
  }])