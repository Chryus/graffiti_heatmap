angular.module("graffitiApp").factory("map",["graffiti",function(e){var t,n={maps:{},markers:[]},a=null,o={},i={},s={},l=new google.maps.LatLng(40.736871,(-73.882369)),r=(new google.maps.StreetViewService,!1);return n.addMap=function(e){i={center:l,zoom:10,streetViewControl:!0,zoomControlOptions:{style:google.maps.ZoomControlStyle.SMALL},mapTypeId:google.maps.MapTypeId.ROADMAP,disableDefaultUI:!1,scrollwheel:!1,draggable:!0,navigationControl:!0,mapTypeControl:!1,scaleControl:!0,disableDoubleClickZoom:!1},a=new google.maps.Map(document.getElementById("map-canvas"),i),n.heatMap(e)},n.heatMap=function(t){s={max:10,data:e.heatmap},o=new HeatmapOverlay(a,{radius:16,dissipating:!1,visible:!0,opacity:80}),google.maps.event.addListener(a,"idle",function(){o.setDataSet(s)}),n.setMapDragEvent(t),n.fetchMarkers(t),console.log("HEAT DATA SET")},n.setMapDragEvent=function(){google.maps.event.addListener(a,"dragend",function(){o.destroy(),i.center=a.getCenter(),o.setDataSet(s)})},n.fetchMarkers=function(e){$.each(s.data,function(e,o){marker=new google.maps.Marker({position:new google.maps.LatLng(o.lat,o.lng),map:a,zIndex:100,icon:"http://maps.google.com/mapfiles/dir_39.png"}),function(e){google.maps.event.addListener(e,"click",function(){t=a.getStreetView(),t.setPosition(e.getPosition()),t.setPov({heading:265,pitch:0}),t.setVisible(!0),n.hide_visibility("button"),google.maps.event.addListener(t,"closeclick",function(){n.render_visibility("button")})}),n.markers.push(e)}(marker,e)}),n.maps[e]=a,n.plotMarkers(null)},n.plotMarkers=function(e){for(var t=0;t<n.markers.length;t++)n.markers[t].setMap(e);r=null!=e},n.toggleMarkers=function(){1==r?n.plotMarkers(null):n.plotMarkers(a)},n.matchLat=function(e){for(var o=0;o<n.markers.length;o++)n.markers[o].position.lat()==e&&(console.log(n.markers[o]),t=a.getStreetView(),t.setPosition(n.markers[o].getPosition()),t.setPov({heading:265,pitch:0}),t.setVisible(!0),n.hide_visibility("button"),google.maps.event.addListener(t,"closeclick",function(){n.render_visibility("button")}))},n.render_visibility=function(e){els=document.getElementsByClassName(e);for(var t=0;t<els.length;++t){var n=els[t].style;n.display="inline"}},n.hide_visibility=function(e){els=document.getElementsByClassName(e);for(var t=0;t<els.length;++t){var n=els[t].style;n.display="none"}},n.getMap=function(e){return n.maps[e]||n.addMap(e),n.maps[e]},$(document).ready(function(){var e=0;$("#map-canvas").on("dblclick",function(){e<1?n.plotMarkers(null):n.plotMarkers(a),e++}),$(document).on("click","#markers",function(){n.toggleMarkers()}),$(document).on("click","#heat",function(){o.toggle()})}),n}]);