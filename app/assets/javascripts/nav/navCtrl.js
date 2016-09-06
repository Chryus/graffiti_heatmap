angular.module('graffitiApp')
  .controller('NavCtrl', [
    '$scope',
    'Auth',
    '$auth',
    function($scope, Auth, $auth) {
      $scope.signedIn = Auth.isAuthenticated;
      $scope.logout = Auth.logout;
      
      Auth.currentUser().then(function(user) {
        $scope.user = user;
      });

      $scope.authenticate = function(provider) {
        $auth.authenticate(provider);
      };

      $scope.$on('devise:new-registration', function  (e, user){
        $scope.user = user;
      });

      $scope.$on('devise:login', function (e, user){
        $scope.user = user;
      });

      $scope.$on('devise:logout', function (e, user){
        $scope.user = {};
      });
    }]);