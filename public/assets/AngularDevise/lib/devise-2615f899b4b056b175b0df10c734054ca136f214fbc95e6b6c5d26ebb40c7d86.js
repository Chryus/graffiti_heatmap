!function(t){"use strict";var e=t.module("Devise",[]);e.provider("AuthIntercept",function(){var t=!1;this.interceptAuth=function(e){return t=!!e||void 0===e,this},this.$get=["$rootScope","$q",function(e,n){return{responseError:function(r){var s=r.config.interceptAuth;if(s=!!s||t&&void 0===s,s&&401===r.status){var o=n.defer();return e.$broadcast("devise:unauthorized",r,o),o.reject(r),o.promise}return n.reject(r)}}}]}).config(["$httpProvider",function(t){t.interceptors.push("AuthIntercept")}]),e.provider("Auth",function(){function e(e,n,r){var i={method:o[e].toLowerCase(),url:s[e]};return n&&(u?(i.data={},i.data[u]=n):i.data=n),t.extend(i,r),i}function n(e,n){t.forEach(e,function(t,r){this[r+n]=function(t){return void 0===t?e[r]:(e[r]=t,this)}},this)}function r(t){return function(){return t}}var s={login:"/users/sign_in.json",logout:"/users/sign_out.json",register:"/users.json",sendResetPasswordInstructions:"/users/password.json",resetPassword:"/users/password.json"},o={login:"POST",logout:"DELETE",register:"POST",sendResetPasswordInstructions:"POST",resetPassword:"PUT"},u="user",i=function(t){return t.data};n.call(this,o,"Method"),n.call(this,s,"Path"),this.resourceName=function(t){return void 0===t?u:(u=t,this)},this.parse=function(t){return"function"!=typeof t?i:(i=t,this)},this.$get=["$q","$http","$rootScope",function(t,n,s){function o(t){return a._currentUser=t,t}function u(){o(null),a._promise=null}function c(t){return function(e){return s.$broadcast("devise:"+t,e),e}}var a={_currentUser:null,parse:i,_promise:null,reset:function(){u(),a.currentUser()},login:function(t,r){var s=arguments.length>0,u=a.isAuthenticated();return t=t||{},n(e("login",t,r)).then(a.parse).then(o).then(function(t){return s&&!u?c("new-session")(t):t}).then(c("login"))},logout:function(t){var s=r(a._currentUser);return n(e("logout",void 0,t)).then(u).then(s).then(c("logout"))},register:function(t,r){return t=t||{},n(e("register",t,r)).then(a.parse).then(o).then(c("new-registration"))},sendResetPasswordInstructions:function(t){return t=t||{},n(e("sendResetPasswordInstructions",t)).then(a.parse).then(c("send-reset-password-instructions-successfully"))},resetPassword:function(t){return t=t||{},n(e("resetPassword",t)).then(a.parse).then(o).then(c("reset-password-successfully"))},currentUser:function(){return a.isAuthenticated()?t.when(a._currentUser):(null===a._promise&&(a._promise=a.login()),a._promise)},isAuthenticated:function(){return!!a._currentUser}};return a}]})}(angular);