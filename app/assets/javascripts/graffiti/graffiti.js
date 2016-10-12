angular.module('graffitiApp')
  .factory('graffiti', [
  '$http',
  'Auth',
  function($http, Auth){
    var o = {
       graffiti: [],
       heatmap: [],
       graffiti_archive: [],
       capture_dates: []
     };
    o.getAll = function() {
      return $http.get('/graffiti.json').success(function(data){
        angular.copy(data.graffiti, o.graffiti);
        angular.copy(data.heatmap, o.heatmap);
      });
    };
    o.get = function(id) {
      return $http.get('/graffiti/' + id + '.json').then(function(res) {
        return res.data;
      });
    };
    o.getArchive = function() {
      return $http.get('/graffiti/archive.json').success(function(data){
        angular.copy(data.graffiti_archive, o.graffiti_archive);
      });
    };
    o.upvote = function(graffito) {
      if (graffito.upvoted == null) {
        return $http.put('/graffiti/' + graffito.id + '/upvote.json').success(function(data) {
          graffito.upvotes += 1;
          graffito['upvoted'] = true;
        });
      }
    };
    o.removeImage = function(filename) {
      return $http({
        method: 'PUT',
        url: '/graffiti/delete_image.json',
        data: {'filename': filename}
      })
      .then(function(res) {
        return res.data
      });
    };
    o.setStreetviewCaptureDates = function() {
      var sv = new google.maps.StreetViewService();
      for (var i = 0; i < o.graffiti.length; i++) {
        (function(index, graffito) { // inline closure to persist graffiti instance
          if (graffito.latitude != null) {
            var current = new google.maps.LatLng(graffito.latitude, graffito.longitude);
            // first check for panorama within 50 meters
            sv.getPanoramaByLocation(current, 50, function(data, status) {
              if (status == 'OK') {
                o.capture_dates.push({id: graffito.id, capture_date: data.imageDate})
              } else {
                // safety net: check for panorama within 200 meters
                sv.getPanoramaByLocation(current, 200, function(data, status) { 
                  if (status == 'OK') { 
                    o.capture_dates.push({id: graffito.id, capture_date: data.imageDate})
                  } else { 
                    console.log("Could not retrieve image date"); 
                  }
                });
              }
            });
          };
        })(i, o.graffiti[i]);
      }
      console.log("Dates Set")
    }
    o.compareCaptureDatesWithGraffitiDates = function() {
     return $http({
        method: 'PUT',
        url: '/graffiti/compare_capture_dates_with_graffiti_dates.json',
        data: {'capture_dates': o.capture_dates}
        })
      .then(function(res) {
        return res.data
      });
    }
    o.saveStreetviewPOV = function(id, marker) {
      return $http({
        method: 'PUT',
        url: '/graffiti/' + id + '.json',
        data: {'graffiti': { 'pov': marker['pov'] } }
      })
      .then(function(res) {
        return res.data
      });
    }
    // o.addComment = function(id, comment) {
    //   return $http.graffito('/graffiti/' + id + '/comments.json', comment);
    // };
    // o.upvoteComment = function(graffito, comment) {
    //   return $http.put('/graffiti/' + graffito.id + '/comments/' + comment.id + '/upvote.json')
    //     .success(function(data) {
    //       comment.upvotes += 1;
    //     });
    // };
  return o;
  }]);