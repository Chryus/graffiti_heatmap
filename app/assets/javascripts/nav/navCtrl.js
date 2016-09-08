angular.module('graffitiApp')
  .controller('NavCtrl', [
    '$scope',
    'Auth',
    '$auth',
    '$state',
    function($scope, Auth, $auth, $state) {

      // facebook auth
      // use satellizer $auth service instead of Auth
      $scope.authenticate = function(provider) {
        debugger
        $auth.authenticate(provider).then(function(user) {
          $scope.user = user.data
          $auth.setToken($scope.user.oauth_token);
        });
      };

      $scope.loggedIn = function() {
        if (Auth.isAuthenticated() == true || $auth.isAuthenticated() == true) {
          return true;
        } else {
          return false;
        }
      }

      $scope.logout = function() {
        if (Auth.isAuthenticated() == true) {
          Auth.logout();
        } else {
          $auth.logout();
        }
      };

      Auth.currentUser().then(function(user) {
        $scope.user = user;
      });

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