angular.module("graffitiApp").controller("MainCtrl",["$scope","$http","$location","graffiti","map",function(t,a,o,i,r){t.currentPath=o.path(),t.map=r.getMap("google"),t.alert=function(){window.alert("Check out the graffito before voting on it.")},t.graffiti=i.graffiti,t.matchLat=function(t){r.matchLat(t)},t.orderProp="-upvotes"}]);