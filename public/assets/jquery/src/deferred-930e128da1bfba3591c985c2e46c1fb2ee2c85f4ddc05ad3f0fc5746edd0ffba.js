define(["./core","./var/slice","./callbacks"],function(e,n){"use strict";function t(e){return e}function r(e){throw e}function i(n,t,r){var i;try{n&&e.isFunction(i=n.promise)?i.call(n).done(t).fail(r):n&&e.isFunction(i=n.then)?i.call(n,t,r):t.call(void 0,n)}catch(e){r.call(void 0,e)}}return e.extend({Deferred:function(n){var i=[["notify","progress",e.Callbacks("memory"),e.Callbacks("memory"),2],["resolve","done",e.Callbacks("once memory"),e.Callbacks("once memory"),0,"resolved"],["reject","fail",e.Callbacks("once memory"),e.Callbacks("once memory"),1,"rejected"]],o="pending",c={state:function(){return o},always:function(){return a.done(arguments).fail(arguments),this},"catch":function(e){return c.then(null,e)},pipe:function(){var n=arguments;return e.Deferred(function(t){e.each(i,function(r,i){var o=e.isFunction(n[i[4]])&&n[i[4]];a[i[1]](function(){var n=o&&o.apply(this,arguments);n&&e.isFunction(n.promise)?n.promise().progress(t.notify).done(t.resolve).fail(t.reject):t[i[0]+"With"](this,o?[n]:arguments)})}),n=null}).promise()},then:function(n,o,c){function a(n,i,o,c){return function(){var s=this,u=arguments,f=function(){var f,d;if(!(n<l)){if(f=o.apply(s,u),f===i.promise())throw new TypeError("Thenable self-resolution");d=f&&("object"==typeof f||"function"==typeof f)&&f.then,e.isFunction(d)?c?d.call(f,a(l,i,t,c),a(l,i,r,c)):(l++,d.call(f,a(l,i,t,c),a(l,i,r,c),a(l,i,t,i.notifyWith))):(o!==t&&(s=void 0,u=[f]),(c||i.resolveWith)(s,u))}},d=c?f:function(){try{f()}catch(t){e.Deferred.exceptionHook&&e.Deferred.exceptionHook(t,d.stackTrace),n+1>=l&&(o!==r&&(s=void 0,u=[t]),i.rejectWith(s,u))}};n?d():(e.Deferred.getStackHook&&(d.stackTrace=e.Deferred.getStackHook()),window.setTimeout(d))}}var l=0;return e.Deferred(function(l){i[0][3].add(a(0,l,e.isFunction(c)?c:t,l.notifyWith)),i[1][3].add(a(0,l,e.isFunction(n)?n:t)),i[2][3].add(a(0,l,e.isFunction(o)?o:r))}).promise()},promise:function(n){return null!=n?e.extend(n,c):c}},a={};return e.each(i,function(e,n){var t=n[2],r=n[5];c[n[1]]=t.add,r&&t.add(function(){o=r},i[3-e][2].disable,i[0][2].lock),t.add(n[3].fire),a[n[0]]=function(){return a[n[0]+"With"](this===a?void 0:this,arguments),this},a[n[0]+"With"]=t.fireWith}),c.promise(a),n&&n.call(a,a),a},when:function(t){var r=arguments.length,o=r,c=Array(o),a=n.call(arguments),l=e.Deferred(),s=function(e){return function(t){c[e]=this,a[e]=arguments.length>1?n.call(arguments):t,--r||l.resolveWith(c,a)}};if(r<=1&&(i(t,l.done(s(o)).resolve,l.reject),"pending"===l.state()||e.isFunction(a[o]&&a[o].then)))return l.then();for(;o--;)i(a[o],s(o),l.reject);return l.promise()}}),e});