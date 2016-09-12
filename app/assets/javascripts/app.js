angular.module('graffitiApp', ['ui.router', 'templates', 'Devise', 'satellizer'])
  .config([
    '$stateProvider',
    '$urlRouterProvider',
    '$authProvider',
    function($stateProvider, $urlRouterProvider, $authProvider) {
      // config facebook client
      // Facebook
      $authProvider.facebook({
        name: 'facebook',
        url: '/auth/facebook',
        clientId: '947788818699822',
        authorizationEndpoint: 'https://www.facebook.com/v2.5/dialog/oauth',
        redirectUri: window.location.origin + '/',
        requiredUrlParams: ['display', 'scope'],
        scope: ['email'],
        scopeDelimiter: ',',
        display: 'popup',
        oauthType: '2.0',
        popupOptions: { width: 580, height: 400 }
      });
      $stateProvider
        .state('home', {
          url: '/home',
          templateUrl: 'home/_home.html',
          controller: 'MainCtrl',
          onEnter: function() {
            $(".gm-iv-back-icon").click() // close streetview
            $("#map-canvas").show(); // show map
          }
        })
        .state('graffiti', {
          url: '/graffiti/:id',
          templateUrl: 'graffiti/_graffiti.html',
          controller: 'GraffitiCtrl',
          onEnter: ['$state', 'graffiti', function($state, graffiti) {
            if (graffiti.graffiti.length == 0) { $state.go('home'); }
          }],
          resolve: {
            graffito: ['$stateParams', 'graffiti', function($stateParams, graffiti) {
              return graffiti.get($stateParams.id);
            }]
          }
        })
        .state('favorites', {
          url: '/favorites',
          templateUrl: 'users/_user.html',
          controller: 'UsersCtrl',
          onEnter: ['$state', 'Auth', '$auth', 'graffiti', function($state, Auth, $auth, graffiti) {
            $(".gm-iv-back-icon").click() // close streetview
            $("#map-canvas").show();
            // go home is no user or graffiti is empty
            if ((Auth.isAuthenticated() != true && $auth.isAuthenticated() != true)) { 
              $state.go('login'); 
            } else if (graffiti.graffiti.length == 0) { $state.go('home') }
          }],
          // must fetch user again so it updates favorites
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
          onEnter: ['$state', 'Auth', '$auth', function($state, Auth, $auth) {
            if ((Auth.isAuthenticated() == true || $auth.isAuthenticated() == true)) { 
              return $state.go('home'); }
            $("#map-canvas").hide();
          }]
        })
        .state('register', {
          url: '/register',
          templateUrl: 'auth/_register.html',
          controller: 'AuthCtrl',
          onEnter: ['$state', 'Auth', '$auth', function($state, Auth, $auth) {
            $("#map-canvas").hide();
            if ((Auth.isAuthenticated() == true || $auth.isAuthenticated() == true)) { 
              $state.go('home'); 
            }
          }]
        })
      $urlRouterProvider.otherwise('home');
    }
  ])