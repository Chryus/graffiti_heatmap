angular.module('graffitiApp', ['ui.router', 'templates', 'Devise'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider){
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'home/_home.html',
          controller: 'mainCtrl',
          onEnter: function() {
            console.log("ENTER HOME");
            $("#map-canvas").show();
          },
          resolve: {
            graffitiPromise: ['graffiti', function(graffiti){
              if (graffiti.graffiti.length == 0) {
                return graffiti.getAll();
              } else {
                return graffiti;
              };
            }]
          }
        })
        .state('graffiti', {
          url: '/graffiti/:id',
          templateUrl: 'graffiti/_graffiti.html',
          controller: 'graffitiCtrl',
          resolve: {
            graffito: ['$stateParams', 'graffiti', function($stateParams, graffiti) {
              return graffiti.get($stateParams.id);
            }]
          }
        })
        .state('login', {
          url: '/login',
          templateUrl: 'auth/_login.html',
          controller: 'AuthCtrl',
          onEnter: ['$state', 'Auth', function($state, Auth) {
            console.log("logging in");
            Auth.currentUser().then(function (){
              $state.go('home');
            })
            $("#map-canvas").hide();
          }]
        })
        .state('register', {
          url: '/register',
          templateUrl: 'auth/_register.html',
          controller: 'AuthCtrl',
          onEnter: ['$state', 'Auth', function($state, Auth) {
            $("#map-canvas").hide();
            Auth.currentUser().then(function (){
              $state.go('home');
            })
          }]
        })
      $urlRouterProvider.otherwise('home');
  }])