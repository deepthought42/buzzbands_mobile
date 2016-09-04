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
        },
        params: {
          mode: null
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
      })

      .state('tab.venueDetails', {
        url: 'venuesList',
        views: {
          'tab-venuesDetails': {
            templateUrl: 'templates/venues/details.html',
            controller: 'VenueDetailsController',
            params: {
              mode: null
            }
          },
          'tab-venuePromotions': {
            templateUrl: 'templates/venues/details.html',
            controller: 'VenuePromotionsController',
            params: {
              mode: null
            }
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
      $scope.errors = [];
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
            zoom: 12,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            streetViewControl: false,
            rotateControl: false
          };

          var map = new google.maps.Map(document.getElementById("map"),
              mapOptions);

          map.setCenter($scope.currentLatLng);
          var circle = new google.maps.Circle({
            center: $scope.currentLatLng,
            radius: 3220, //meters in 2 miles
            strokeColor : '#de519b',
            strokeWeight: 1,
            strokeOpacity: .9,
            fillColor : '#de519b',
            fillOpacity: .1,
            map: map
          });

          $scope.map = map;

          $scope.queryVenues(pos.coords.latitude, pos.coords.longitude).$promise
            .then(function(data){
              $scope.venueList = data;
              for(var i=0; i< $scope.venueList.length; i++){
                var venueLatLng = new google.maps.LatLng($scope.venueList[i].latitude, $scope.venueList[i].longitude);

                var marker = new google.maps.Marker({
                  position: venueLatLng,
                  map: $scope.map,
                  title: $scope.venueList[i].name,
                  icon: 'https://s3-us-west-2.amazonaws.com/hypedrive.io/images/lightning_icon_pink2.png'
                });

/*
                var marker = new RichMarker({
                        position: new google.maps.LatLng($scope.venueList[i].latitude, $scope.venueList[i].longitude),
                        map: $scope.map,
                        draggable: false,
                        flat:true,
                        anchor: RichMarkerPosition.MIDDLE,
                        content: '<ion-icon class="flash"></ion-icon>'
                    });
*/

                marker.addListener('click', function() {
                  $state.go("tab.venueDetails", { "venue_id": 1 , "mode": 'stats'});
                });
              }
            });
        }, function(error) {
          $ionicLoading.hide();

          $scope.errors.push("Unable to get location");
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
            radius: 3220,   //meters in 2 miles
            strokeColor : '#FE7155',
            strokeWeight: 20,
            fillColor : '#FEB5A6',
            map: map
          });

          $scope.map = map;
            $scope.queryVenues(42.3499958, -71.0656288)
              .then(function(data){
                console.log("successfully queried venues :: "+data);
                $scope.venueList = data;
                for(var i=0; i< $scope.venueList.length; i++){
                  $scope.venue = $scope.venueList[i];
                  var venueLatLng = new google.maps.LatLng($scope.venueList[i].latitude, $scope.venueList[i].longitude);

                  var marker = new google.maps.Marker({
                    position: venueLatLng,
                    map: $scope.map,
                    title: '$scope.venueList[i].name',
                    icon: '',
                    labelContent: '<i class="fa fa-send fa-3x" style="color:rgba(153,102,102,0.8);"></i>',
                    labelAnchor: new google.maps.Point(22, 50)
                  });

                  marker.addListener('click', function() {
                    //map.setZoom(8);
                    //map.setCenter(marker.getPosition());
                    $state.go("tab.venueDetails", { "venue_id": $scope.venue.id, "mode": 'stats' });
                  });
                }
              });
        });
      }
      google.maps.event.addDomListener(window, 'load', initialize);


      $scope.centerOnMe = function() {

      };

      $scope.clickTest = function() {
        //alert('Example of infowindow with ng-click')
      };

    $scope.queryVenues = function(latitude, longitude){
      return Venue.getNearMe({lat: latitude, lng: longitude});
    }

    $scope.deleteVenue = function(venueId){
      Venue.remove({id: venueId}).$promise
        .then(function(data){
          $scope.venueList = $scope.queryVenues();
          state.go("venues");
        })
        .catch(function(data){
          $scope.errors.push("Could not delete venue");
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
              $scope.errors.push("Error deleting venue");
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
                                          '$cordovaGeolocation', '$state', '$ionicLoading',
  function($scope, Venue, VenuePromotion, stateParams, $localStorage, $cordovaGeolocation, $state, $ionicLoading) {
    this._init = function(){
      $localStorage.venue_id = stateParams.venue_id;

      $scope.errors = [];
      $scope.venueList = {};

    }


    $scope.ratingsObject = {
      iconOn: 'ion-ios-star',    //Optional
      iconOff: 'ion-ios-star-outline',   //Optional
      iconOnColor: 'rgb(200, 200, 100)',  //Optional
      iconOffColor:  'rgb(200, 100, 100)',    //Optional
      rating:  2, //Optional
      minRating:1,    //Optional
      readOnly: true, //Optional
      callback: function(rating) {    //Mandatory
        $scope.ratingsCallback(rating);
      }
    };

    $scope.ratingsCallback = function(rating) {
      console.log('Selected rating is : ', rating);
    };

    $scope.loading = $ionicLoading.show({
      content: 'Getting current location...',
      showBackdrop: false
    });

    var options = {timeout: 10000, enableHighAccuracy: true};
    $cordovaGeolocation.getCurrentPosition(options).then(function(pos) {
        //$scope.venueLatLng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
        console.log("venue list : " + pos.coords.latitude);
        $scope.venueList = Venue.getNearMe({lat: pos.coords.latitude, lng: pos.coords.longitude});
        $ionicLoading.hide();
      })
      .catch(function(data){
        $scope.errors.push("Error getting venues");
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
        $state.go("tab.venueDetails", { "venue_id": venue_id, "mode": 'promotions' });
      }


      this._init();
}]);

venue.controller('VenuePromotionsController', ['$rootScope', '$scope', 'VenuePromotion', '$stateParams', '$localStorage', '$location',
  function($rootScope, $scope, VenuePromotion, stateParams, $localStorage, $location) {

    this._init = function(){
        $scope.errors = [];
        $localStorage.venue_id = stateParams.venue_id;

        $scope.mode = stateParams.mode;
        $scope.rating = {};
        $scope.rating.rate = 3;
        $scope.rating.max = 5;
    }

    $scope.$on('$ionicView.beforeEnter', function (event, viewData) {
      viewData.enableBack = true;
    });

    $scope.showVenueStats = function(){
      $scope.mode = "stats";
    }

    $scope.showVenuePromotions = function(){
      $scope.mode = "promotions";
    }

    VenuePromotion.query({venue_id: $localStorage.venue_id}).$promise
      .then(function(data){
        //alert("successfully queried venue promotions :: "+data);
        $scope.promotions = data;
        //$scope.main_ad_location = data[0].ad_location;
      })
      .catch(function(data){
        $scope.errors.push("Error getting venues.");
      });

    this._init();
}]);
