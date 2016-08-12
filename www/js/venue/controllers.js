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
      .state('tab.venues', {
        url: 'venues',
        views: {
          'tab-venues': {
            templateUrl: 'templates/venues/index.html',
            controller: 'VenueIndexController'
          }
        }
      });
  }
]);

venue.controller('VenueIndexController', ['$scope', 'Venue', '$state',
                 '$cordovaGeolocation', '$ionicLoading', '$compile',
  function($scope, Venue, state, $cordovaGeolocation, $ionicLoading, $compile) {
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

        var marker = new google.maps.Marker({
          position: myLatlng,
          map: map,
          title: 'Uluru (Ayers Rock)'
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
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP
          };

          var map = new google.maps.Map(document.getElementById("map"),
              mapOptions);

          map.setCenter($scope.currentLatLng);
          var circle = new google.maps.Circle({
            center: $scope.currentLatLng,
            radius: 500,
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
                console.log(Object.keys($scope.venueList[i]));
                console.log("COORD : "+$scope.venueList[i].latitude +","+ $scope.venueList[i].longitude);
              }
            });
        }, function(error) {
          $ionicLoading.hide();
          /*
          alert('Unable to get location: ' + error.message);

          $scope.currentLatLng = new google.maps.LatLng(42.3489958, -71.0656288);

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

          $scope.map = map;
            $scope.queryVenues(42.3499958, -71.0656288).$promise
              .then(function(data){
                console.log("successfully queried venues :: "+data);
                $scope.venueList = data;
                for(var i=0; i< $scope.venueList.length; i++){
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
                  console.log(Object.keys($scope.venueList[i]));
                  console.log("COORD : "+$scope.venueList[i].latitude +","+ $scope.venueList[i].longitude);
                }
              });
              */
        });
      }
      google.maps.event.addDomListener(window, 'load', initialize);


      $scope.centerOnMe = function() {

      };

      $scope.clickTest = function() {
        alert('Example of infowindow with ng-click')
      };

    $scope.queryVenues = function(latitude, longitude){
      console.log("CURRENT LAT : "+latitude);
      console.log("CURRENT LNG : "+longitude);
      return Venue.query({lat: latitude, lng: longitude})/*.$promise
        .then(function(data){
          console.log("successfully queried venues :: "+data);
          $scope.venueList = data;
          for(var i=0; i< $scope.venueList.length; i++){
            console.log(Object.keys($scope.venueList[i]));
            console.log("COORD : "+$scope.venueList[i].latitude +","+ $scope.venueList[i].longitude);
          }
        })
        .catch(function(data){
          console.log("error querying venues")
        });
        */
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

venue.controller('VenuePromotionsIndexController', ['$scope', 'VenuePromotion', '$stateParams', '$localStorage',
  function($scope, VenuePromotion, stateParams, $localStorage) {
    $localStorage.venue_id = stateParams.venue_id;

    VenuePromotion.query({venue_id: $localStorage.venue_id}).$promise
      .then(function(data){
        //alert("successfully queried venue promotions :: "+data);
        $scope.promotions = data;
        //$scope.main_ad_location = data[0].ad_location;
      })
      .catch(function(data){
        alert("error querying venues")
      });
}]);
