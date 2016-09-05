'use strict';

var venue = angular.module('buzzbands.venue.controllers',
                          ['buzzbands.venue.service']);

venue.config(['$stateProvider',
  function($stateProvider) {
    $stateProvider

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
        url: '/venueDetails',
        views: {
          'tab-venuesList': {
            templateUrl: 'templates/venues/details.html',
            controller: 'VenuePromotionsController'
          }
        },
        params: {
          venue: null,
          mode: 'stats'
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
                  //icon: 'https://s3-us-west-2.amazonaws.com/hypedrive.io/images/lightning_icon_pink2.png'
                  icon: 'img/lightning_icon_pink2.png'
                });
                $scope.attachVenue(marker, $scope.venueList[i], 'promotions');

              }
            });
        }, function(error) {
          $ionicLoading.hide();

          $scope.errors.push("Unable to get location");
          $scope.currentLatLng = new google.maps.LatLng(42.3489958, -71.0656288);

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
            radius: 3220,   //meters in 2 miles
            strokeColor : '#de519b',
            strokeWeight: 1,
            strokeOpacity: .9,
            fillColor : '#de519b',
            fillOpacity: .1,
            map: map
          });

          $scope.map = map;
            $scope.queryVenues(42.3499958, -71.0656288).$promise
              .then(function(data){
                console.log("successfully queried venues :: "+data);
                $scope.venueList = data;
                for(var i=0; i< $scope.venueList.length; i++){
                  //$scope.venue = $scope.venueList[i];
                  var venueLatLng = new google.maps.LatLng($scope.venueList[i].latitude, $scope.venueList[i].longitude);

                  var marker = new google.maps.Marker({
                    position: venueLatLng,
                    map: $scope.map,
                    title: $scope.venueList[i].name,
                    icon: '',
                    labelContent: '<i class="fa fa-send fa-3x" style="color:rgba(153,102,102,0.8);"></i>',
                    labelAnchor: new google.maps.Point(22, 50)
                  });
                  $scope.attachVenue(marker, $scope.venueList[i], 'promotions');

                }
              });
        });
      }
      google.maps.event.addDomListener(window, 'load', initialize);

      // Attaches an info window to a marker with the provided message. When the
      // marker is clicked, the info window will open with the secret message.
      $scope.attachVenue = function(marker, venue, mode) {
        marker.addListener('click', function() {
          console.log('clicking on '+venue.name);
          $state.go("tab.venueDetails",
            {
              "venue": venue,
              "mode": mode
            }
          );
        });
      }

      $scope.centerOnMe = function() {

      };

      $scope.clickTest = function() {
        //alert('Example of infowindow with ng-click')
      };

    $scope.queryVenues = function(latitude, longitude){
      return Venue.getNearMe({lat: latitude, lng: longitude});
    }

    $scope.editVenue = function(venue){
      $scope.venueLoaded = true;
      $scope.venue = venue;
    }

    $scope.showCreatePanel = function(venue){
      $scope.venueLoaded = false;
      $scope.venue = {};
    }

    $scope.isActive = function(object) {
      return object.active === true;
    }

    $scope.$on("refreshVenuesList", function(event, data){
      $scope.venueList = $scope.queryVenues();
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
        $ionicLoading.hide();

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

      $scope.showVenuePromotions = function(venue){
        $state.go("tab.venueDetails", { "venue": venue, "mode": 'promotions' });
      }


      this._init();
}]);

venue.controller('VenuePromotionsController', ['$rootScope', '$scope', 'VenuePromotion', '$stateParams', '$localStorage', '$location',
  function($rootScope, $scope, VenuePromotion, stateParams, $localStorage, $location) {
    this._init = function(){
        $scope.errors = [];
        $localStorage.venue =  stateParams.venue;
        $scope.venue = stateParams.venue;
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

    $scope.goToPromotionDetails = function(promotion){
      $state.go("tab.promotionDetails", {"promotion": promotion});
    }

    this._init();

    VenuePromotion.query({venue_id: $scope.venue.id}).$promise
      .then(function(data){
        $scope.promotionList = data;
        //$scope.main_ad_location = data[0].ad_location;
      })
      .catch(function(data){
        $scope.errors.push("Error getting venues.");
      });
}]);
