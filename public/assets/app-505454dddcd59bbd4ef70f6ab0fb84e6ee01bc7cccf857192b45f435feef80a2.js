angular.module("graffitiApp",["ui.router","templates","Devise"]).config(["$stateProvider","$urlRouterProvider",function(t,e){t.state("home",{url:"/home",templateUrl:"home/_home.html",controller:"MainCtrl",onEnter:function(){$(".gm-iv-back-icon").click(),$("#map-canvas").show()}}).state("graffiti",{url:"/graffiti/:id",templateUrl:"graffiti/_graffiti.html",controller:"GraffitiCtrl",resolve:{graffitiPromise:["graffiti",function(t){return 0==t.graffiti.length?t.getAll():t}],graffito:["$stateParams","graffiti",function(t,e){return e.get(t.id)}]}}).state("favorites",{url:"/favorites",templateUrl:"users/_user.html",controller:"UsersCtrl",onEnter:function(){$(".gm-iv-back-icon").click(),$("#map-canvas").show()},resolve:{user:["users",function(t){return t.getUser()}]}}).state("login",{url:"/login",templateUrl:"auth/_login.html",controller:"AuthCtrl",onEnter:["$state","Auth",function(t,e){console.log("logging in"),e.currentUser().then(function(){t.go("home")}),$("#map-canvas").hide()}]}).state("register",{url:"/register",templateUrl:"auth/_register.html",controller:"AuthCtrl",onEnter:["$state","Auth",function(t,e){$("#map-canvas").hide(),e.currentUser().then(function(){t.go("home")})}]}),e.otherwise("home")}]);