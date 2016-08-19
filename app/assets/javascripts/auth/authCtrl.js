angular.module('graffitiApp')
.controller('AuthCtrl', [
  '$scope',
  '$state',
  'Auth',
  function($scope, $state, Auth){
    $scope.login = function() {
      console.log("GOING HOME!");
      Auth.login($scope.user).then(function(){
        console.log("GOING HOME!");
        $state.go('home');
      });
    };
    $scope.register = function() {
      Auth.register($scope.user).then(function(){
        $state.go('home');
      });
    };
  }])