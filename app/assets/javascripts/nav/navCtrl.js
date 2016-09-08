angular.module('graffitiApp')
  .controller('NavCtrl', [
    '$scope',
    'Auth',
    '$auth',
    '$state',
    function($scope, Auth, $auth, $state) {

      $scope.loggedIn = function() {
        if (Auth.isAuthenticated() == true || $scope.signedInWithFacebook == true) {
          return true;
        } else {
          return false;
        }
      }

      $scope.logout = function() {
        if (Auth.isAuthenticated() == true) {
          Auth.logout();
        } else {
          $scope.signedInWithFacebook = false;
        }
      };

      Auth.currentUser().then(function(user) {
        $scope.user = user;
      });

      // facebook auth
      // use satellizer $auth service instead of Auth
      $scope.authenticate = function(provider) {
        $auth.authenticate(provider).then(function(user) {
          $scope.user = user.data
          $scope.signedInWithFacebook = true;
        });
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