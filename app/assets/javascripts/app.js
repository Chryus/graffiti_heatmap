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
          resolve: {
            graffitiPromise: ['graffiti', function(graffiti){
              return graffiti.getAll();
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
            Auth.currentUser().then(function (){
              $state.go('home');
            })
          }]
        })
        .state('register', {
          url: '/register',
          templateUrl: 'auth/_register.html',
          controller: 'AuthCtrl',
          onEnter: ['$state', 'Auth', function($state, Auth) {
            Auth.currentUser().then(function (){
              $state.go('home');
            })
          }]
        })
      $urlRouterProvider.otherwise('home');
  }])