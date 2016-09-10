angular.module('graffitiApp', ['ui.router', 'templates', 'Devise', 'satellizer'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$authProvider',
    function($stateProvider, $urlRouterProvider, $authProvider) {
      $authProvider.facebook({
        clientId: '947788818699822',
        redirectUri: window.location.origin + '/'
      });
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'home/_home.html',
          controller: 'MainCtrl',
          onEnter: function() {
            $(".gm-iv-back-icon").click() // close streetview
            $("#map-canvas").show();
          }
        })
        .state('graffiti', {
          url: '/graffiti/:id',
          templateUrl: 'graffiti/_graffiti.html',
          controller: 'GraffitiCtrl',
          resolve: {
            graffitiPromise: ['graffiti', function(graffiti) {
              if (graffiti.graffiti.length == 0) {
                return graffiti.getAll();
              } else {
                return graffiti;
              };
            }],
            graffito: ['$stateParams', 'graffiti', function($stateParams, graffiti) {
              return graffiti.get($stateParams.id);
            }]
          }
        })
        .state('favorites', {
          url: '/favorites',
          templateUrl: 'users/_user.html',
          controller: 'UsersCtrl',
          onEnter: function($state, users) {
            $(".gm-iv-back-icon").click() // close streetview
            $("#map-canvas").show();
            if (users.user == null) { return $state.go('home'); }
          },
          resolve: {
            user: ['users', function(users) {
              return users.getUser();
            }]
          }
        })
        .state('login', {
          url: '/login',
          templateUrl: 'auth/_login.html',
          controller: 'AuthCtrl',
          onEnter: ['$state', 'Auth', function($state, Auth) {
            console.log("logging in");
            Auth.currentUser().then(function() {
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
            Auth.currentUser().then(function() {
              $state.go('home');
            })
          }]
        })
      $urlRouterProvider.otherwise('home');
    }
  ])