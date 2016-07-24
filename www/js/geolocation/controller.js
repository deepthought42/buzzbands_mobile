var geolocation = angular.module('geolocation.controllers', ['uiGmapgoogle-maps']);
geolocation.config(function(uiGmapGoogleMapApiProvider) {
  uiGmapGoogleMapApiProvider.configure({
      key: 'AIzaSyBbhjPwUZ4dy5EOFD3uaOJVZnuOqHSYUjI',
      v: '3.24', //defaults to latest 3.X anyhow
      libraries: 'weather,geometry,visualization'
  });
});
geolocation.controller('GeoCtrl', ['$scope', '$cordovaGeolocation', 'uiGmapGoogleMapApi',
function($scope, $cordovaGeolocation, uiGmapGoogleMapApi) {
  // uiGmapGoogleMapApi is a promise.
  // The "then" callback function provides the google.maps object.
  $scope.map = { center: { latitude: 45, longitude: -73 }, zoom: 8 };

  uiGmapGoogleMapApi.then(function(maps) {

  });

  var posOptions = {timeout: 10000, enableHighAccuracy: false};
  $cordovaGeolocation
    .getCurrentPosition(posOptions)
    .then(function (position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;

      alert("LAT : "+lat+"; LONG : "+long);
    }, function(err) {
      console.log("Failed to load lat and long")
    });


  var watchOptions = {
    timeout : 3000,
    enableHighAccuracy: false // may cause errors if true
  };

  var watch = $cordovaGeolocation.watchPosition(watchOptions);
  watch.then(
    null,
    function(err) {
      // error
    },
    function(position) {
      var lat  = position.coords.latitude;
      var long = position.coords.longitude;
  });


  watch.clearWatch();
  // OR
  /*$cordovaGeolocation.clearWatch(watch)
    .then(function(result) {
        // success
      }, function (error) {
        // error
    });
      */
}]);
