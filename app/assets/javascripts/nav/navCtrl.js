angular.module('graffitiApp')
  .controller('NavCtrl', [
    '$scope',
    'Auth',
    '$auth',
    '$state',
    '$http',
    'users',
    'map',
    function($scope, Auth, $auth, $state, $http, users, map) {
      $scope.loading = true;

      // watch for map to be loaded then reset ng-hide attr
      $scope.$watch(function() { return map.loading }, function (newVal, oldVal, scope) {
        if (newVal == false) {
          $scope.loading = newVal;
        }
      });

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
        })
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
          $http.delete('/clear_token.json').then(function(res) {
            return res.data;
          });
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