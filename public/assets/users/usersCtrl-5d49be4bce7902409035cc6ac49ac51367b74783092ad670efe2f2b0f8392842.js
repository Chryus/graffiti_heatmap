angular.module("graffitiApp").controller("UsersCtrl",["$scope","users","map",function(r,t,a){r.user=t.user,r.graffiti=t.user.graffiti,r.matchLat=function(r){a.matchLat(r)},r.orderProp="-upvotes"}]);