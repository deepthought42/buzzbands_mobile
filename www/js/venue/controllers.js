'use strict';

var venue = angular.module('buzzbands.venue.controllers',
                          ['buzzbands.venue.service']);

venue.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider
      .state('tab.venuePromotions', {
        url: 'venues/:venue_id/promotions',
        views: {
          "tab-venuePromotions": {
            templateUrl: 'templates/promotions/index.html',
            controller: 'VenuePromotionsIndexController'
          }
        }
      })
      .state('tab.venuesMap', {
        url: 'venuesMap',
        views: {
          'tab-venuesMap': {
            templateUrl: 'templates/venues/map.html',
            controller: 'VenueMapController'
          }
        }
      })
      .state('tab.venuesList', {
        url: 'venuesList',
        views: {
          'tab-venuesList': {
            templateUrl: 'templates/venues/index.html',
            controller: 'VenueIndexController'
          }
        }
      });
  }
]);

venue.controller('VenueMapController', ['$scope', 'Venue', '$state',
                 '$cordovaGeolocation', '$ionicLoading', '$compile', '$state',
  function($scope, Venue, state, $cordovaGeolocation, $ionicLoading, $compile, $state) {
    $scope.venueLoaded = false;
    $scope.map={};

    function initialize() {
        //var myLatlng = new google.maps.LatLng(-71.0656288,42.3499958);


        //Marker + infowindow + angularjs compiled ng-click
  /*      var contentString = "<div><a ng-click='clickTest()'>Click me!</a></div>";
        var compiled = $compile(contentString)($scope);

        var circle = new google.maps.Circle({
          center: myLatlng,
          radius: 300,
          strokeColor : '#AA00FF',
          strokeWidth: 5,
          fillColor : '#880000',
          map: map
        });
*/
/*        var infowindow = new google.maps.InfoWindow({
          content: compiled[0]
        });

        google.maps.event.addListener(marker, 'click', function() {
          infowindow.open(map,marker);
        });

        $scope.map = map;

        if(!$scope.map) {
          return;
        }
*/

        $scope.loading = $ionicLoading.show({
          content: 'Getting current location...',
          showBackdrop: false
        });

        var options = {timeout: 10000, enableHighAccuracy: true};
        $cordovaGeolocation.getCurrentPosition(options).then(function(pos) {
          console.log("Current location : "+pos.coords.latitude + " :: " + pos.coords.longitude);
          $ionicLoading.hide();

          $scope.currentLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);

          var mapOptions = {
            center: $scope.currentLatLng,
            zoom: 16,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          var map = new google.maps.Map(document.getElementById("map"),
              mapOptions);

          map.setCenter($scope.currentLatLng);
          var circle = new google.maps.Circle({
            center: $scope.currentLatLng,
            radius: 300,
            strokeColor : '#FE7155',
            strokeWidth: 5,
            fillColor : '#FEB5A6',
            map: map
          });

          var marker = new google.maps.Marker({
            position: $scope.currentLatLng,
            map: map,
            title: 'I am here'
          });

          marker.addListener('click', function() {
            map.setZoom(8);
            map.setCenter(marker.getPosition());

            $state.go("tab.venuePromotions", { "venue_id": 1 });
          });

          $scope.map = map;

          $scope.queryVenues($scope.currentLatLng.lat, $scope.currentLatLng.lng).$promise
            .then(function(data){
              console.log("successfully queried venues :: "+data);
              $scope.venueList = data;
              for(var i=0; i< $scope.venueList.length; i++){
                var venueLatLng = new google.maps.LatLng($scope.venueList[i].latitude, $scope.venueList[i].longitude);

                var marker = new google.maps.Marker({
                  position: venueLatLng,
                  map: $scope.map,
                  title: $scope.venueList[i].name
                });
              }
            });
        }, function(error) {
          $ionicLoading.hide();

          alert('Unable to get location: ' + error.message);

          $scope.currentLatLng = new google.maps.LatLng(42.3489958, -71.0656288);

          var mapOptions = {
            center: $scope.currentLatLng,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          var map = new google.maps.Map(document.getElementById("map"),
              mapOptions);

          map.setCenter($scope.currentLatLng);
          var circle = new google.maps.Circle({
            center: $scope.currentLatLng,
            radius: 300,
            strokeColor : '#FE7155',
            strokeWidth: 5,
            fillColor : '#FEB5A6',
            map: map
          });

          var marker = new google.maps.Marker({
            position: $scope.currentLatLng,

            map: map,
            title: 'I am here'
          });


          $scope.map = map;
            $scope.queryVenues(42.3499958, -71.0656288).$promise
              .then(function(data){
                console.log("successfully queried venues :: "+data);
                $scope.venueList = data;
                for(var i=0; i< $scope.venueList.length; i++){
                  $scope.venue = $scope.venueList[i];
                  var venueLatLng = new google.maps.LatLng($scope.venueList[i].latitude, $scope.venueList[i].longitude);
                  var goldStar = {
                            path: 'M 125,5 155,90 245,90 175,145 200,230 125,180 50,230 75,145 5,90 95,90 z',
                            fillColor: 'yellow',
                            fillOpacity: 0.8,
                            scale: .1,
                            strokeColor: 'gold',
                            strokeWeight: 14
                          };
                  var marker = new google.maps.Marker({
                    position: venueLatLng,
                    icon: goldStar,
                    map: $scope.map,
                    title: '$scope.venueList[i].name'
                  });

                  marker.addListener('click', function() {
                    console.log("CLICKED");
                    //map.setZoom(8);
                    //map.setCenter(marker.getPosition());
                    console.log("VENUE ID :: "+ $scope.venue.id);
                    $state.go("tab.venuePromotions", { "venue_id": $scope.venue.id });
                  });

                  console.log(Object.keys($scope.venueList[i]));
                  console.log("COORD : "+$scope.venueList[i].latitude +","+ $scope.venueList[i].longitude);
                }
              });

        });
      }
      google.maps.event.addDomListener(window, 'load', initialize);


      $scope.centerOnMe = function() {

      };

      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };

    $scope.queryVenues = function(latitude, longitude){
      return Venue.query({lat: latitude, lng: longitude});
    }

    $scope.queryVenues(42.3499958, -71.0656288);

    $scope.deleteVenue = function(venueId){
      Venue.remove({id: venueId}).$promise
        .then(function(data){
          $scope.venueList = $scope.queryVenues();
          state.go("venues");
        })
        .catch(function(data){
          console.log("an error occurred while deleting venue");
        });
    }

    $scope.deleteVenues = function(){
      for(var i=0; i<$scope.venueList.length; i++){
        if($scope.venueList[i].selected){
          Venue.remove({id: $scope.venueList[i].id}).$promise
            .then(function(data){
              $scope.venueList = $scope.queryVenues();
            })
            .catch(function(data){
              console.log("an error occurred while deleting venue");
            });
          }
        }
    }

    $scope.editVenue = function(venue){
      $scope.venueLoaded = true;
      $scope.venue = venue;
    }

    $scope.showCreatePanel = function(venue){
      $scope.venueLoaded = false;
      $scope.venue = {};
    }

    $scope.showPromotionsList = function(venueId){
      state.go("promotions.dashboard", {"venueId": venueId});
    }

    $scope.isActive = function(object) {
      return object.active === true;
    }

    $scope.$on("refreshVenuesList", function(event, data){
      $scope.venueList = $scope.queryVenues();
    })

    $scope.$on("showCreateVenueView", function(event, data){
      $scope.venueLoaded = false;
    })


    $scope.selectAll = function(selected){
      for(var i=0; i<$scope.venueList.length; i++){
        console.log("selecting all");

        $scope.venueList[i].selected = selected;
      }
    };

    initialize();
    //watch.clearWatch();
    // OR
    /*
    $cordovaGeolocation.clearWatch(watch)
      .then(function(result) {
          // success
        }, function (error) {
          // error
      });
      */
  }
]);

venue.controller('VenueIndexController', ['$scope', 'Venue', 'VenuePromotion',
                                          '$stateParams', '$localStorage',
                                          '$cordovaGeolocation', '$state',
  function($scope, Venue, VenuePromotion, stateParams, $localStorage, $cordovaGeolocation, $state) {
    $localStorage.venue_id = stateParams.venue_id;

    var options = {timeout: 10000, enableHighAccuracy: true};
    $scope.venueLatLng = {}
    $cordovaGeolocation.getCurrentPosition(options).then(function(pos) {
        $scope.venueLatLng = new google.maps.LatLng($scope.venueList[i].latitude, $scope.venueList[i].longitude);
      })
      .catch(function(data){
        alert("error querying venues")
      });

      /*
       * if given group is the selected group, deselect it
       * else, select the given group
       */
      $scope.toggleVenue = function(venue) {
        if ($scope.isVenueShown(venue)) {
          $scope.shownVenue = null;
        } else {
          $scope.shownVenue = venue;
        }
      };
      $scope.isVenueShown = function(venue) {
        return $scope.shownVenue === venue;
      };

      $scope.showVenuePromotions = function(venue_id){
        $state.go("tab.venuePromotions", { "venue_id": venue_id });
        console.log("SHOWING VENUE PROMOTIONS");
      }

      $scope.venueList = Venue.query($scope.venueLatLng);
}]);

venue.controller('VenuePromotionsIndexController', ['$scope', 'VenuePromotion', '$stateParams', '$localStorage',
  function($scope, VenuePromotion, stateParams, $localStorage) {
    console.log("LOADING VENUE PROMOTIONS");

    $localStorage.venue_id = stateParams.venue_id;
    VenuePromotion.query({venue_id: $localStorage.venue_id}).$promise
      .then(function(data){
        console.log("VENUE PROMOTIONS GRABBED");
        //alert("successfully queried venue promotions :: "+data);
        $scope.promotions = data;
        //$scope.main_ad_location = data[0].ad_location;
      })
      .catch(function(data){
        alert("error querying venues")
      });
}]);
