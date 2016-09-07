angular.module('graffitiApp')
  .controller('NavCtrl', [
    '$scope',
    'Auth',
    '$auth',
    function($scope, Auth, $auth) {
      $scope.signedIn = Auth.isAuthenticated || $auth.isAuthenticated;
      $scope.logout = Auth.logout;
      
      Auth.currentUser().then(function(user) {
        $scope.user = user;
      });

      // facebook auth
      // use satellizer $auth service instead of Auth
      $scope.authenticate = function(provider) {
        $auth.authenticate(provider).then(function(user) {
          $scope.user = user.data;
        });
        $auth.isAuthenticated = true;
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