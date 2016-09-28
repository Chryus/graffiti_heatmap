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
        // if token exists, we should fetch user from token
        token = $auth.getToken()
        if (token != null) {
          return $http.get('/from_token.json', {params: { token: token } }).then(function(user) {
            return angular.copy(user.data, o.user);
          }, function errorCallback(response) {
            $auth.logout();
            console.log(response.data.message);
          });
        } else {
        return Auth.currentUser().then(function (user){
          // must fetch user again because Auth.currentUser is old user state
          return $http.get('/users/' + user.id + '.json').success(function(data){
            angular.copy(data, o.user);
          });
        });
      }
    };
  return o;
  }]);