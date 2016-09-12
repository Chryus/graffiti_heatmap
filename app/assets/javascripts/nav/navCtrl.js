angular.module('graffitiApp')
  .controller('NavCtrl', [
    '$scope',
    'Auth',
    '$auth',
    '$state',
    'users',
    function($scope, Auth, $auth, $state, users) {
      // set user if authenticated by token
      if ($scope.user == null && $auth.isAuthenticated() == true) {
        users.getUser().then(function(user) {
          $scope.user = user
        });
      }

      // facebook auth
      // use satellizer $auth service instead of Auth
      $scope.authenticate = function(provider) {
        $auth.authenticate(provider).then(function(user) {
          $scope.user = user.data
          $auth.setToken($scope.user.oauth_token);
        }).catch(function (data) {
          var ua = window.navigator.userAgent;
          var msie = ua.indexOf("Safari");

          if (msie > 0){ window.close() }
        });
      };

      $scope.loggedIn = function() {
        if (Auth.isAuthenticated() == true || $auth.isAuthenticated() == true) {
          console.log("AUTHENTICATED!");
          return true;
        } else {
          return false;
        }
      }

      $scope.logout = function() {
        if (Auth.isAuthenticated() == true) {
          Auth.logout();
          $state.go('home');
        } else {
          $auth.logout();
          $scope.user = {};
          $state.go('home');
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