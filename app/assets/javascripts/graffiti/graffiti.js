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
      return $http.get('/get_graffiti.json').success(function(data){
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
    o.setGoogleImageDates = function() {
      for (index in o.graffiti) {
        graffito = o.graffiti[index];
        if (graffito.latitude != null) {
          var sv = new google.maps.StreetViewService();
          var current = new google.maps.LatLng(graffito.latitude, graffito.longitude);
          var date;
          sv.getPanoramaByLocation(current, 10, function(data) {
            debugger
            o.capture_dates.push({id: graffito.id, capture_date: data.imageDate})
          });
        };
      }
      console.log("Dates Set")
    }
    o.sendCaptureDatesToDB = function() {
     return $http({
        method: 'PUT',
        url: '/graffiti/gmaps_streetview_capture_dates.json',
        data: {'capture_dates': o.capture_dates}
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