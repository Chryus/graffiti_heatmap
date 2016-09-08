angular.module('graffitiApp')
  .factory('users', [
  '$http',
  'Auth',
  '$auth',
  function($http, Auth, $auth){
    var o = {
       user: {}
    };
    o.getUser = function(id) {
        token = $auth.getToken()
        if (token != null) {
          return $http.get('/from_token.json', { token: token }).success(function(data) {
            angular.copy(data, o.user);
          });
        } else {
        return Auth.currentUser().then(function (user){
          return $http.get('/users/' + user.id + '.json').success(function(data){
            angular.copy(data, o.user);
          });
        });
      }
    };
  return o;
  }]);