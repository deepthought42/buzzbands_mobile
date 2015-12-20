'use strict';

angular.module('buzzbands.venue.controllers', ['buzzbands.venue.service'])

.config(['$stateProvider', function($stateProvider) {
  $stateProvider.state('tab.venues', {
      url: '/venues',
      views: {
        'venues': {
          templateUrl: 'templates/venues/index.html',
          controller: 'VenueIndexController'
        }
      }
    })
    .state('tab.venuePromotions', {
        url: 'venues/:venue_id/promotions',
        views: {
          "tab-venuePromotions": {
            templateUrl: 'templates/promotions/index.html',
            controller: 'VenuePromotionsIndexController'
          }
        }
      })
}])

.controller('VenueIndexController', ['$scope', 'Venue', '$state', function($scope, Venue, state, session) {
  $scope.venueLoaded = false;

  $scope.queryVenues = function(){
    Venue.query().$promise
      .then(function(data){
        console.log("successfully queried venues :: "+data);
        $scope.venueList = data;
      })
      .catch(function(data){
        console.log("error querying venues")
      });
  }

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

  $scope.venueList = $scope.queryVenues();

  $scope.selectAll = function(selected){
    for(var i=0; i<$scope.venueList.length; i++){
      console.log("selecting all");

      $scope.venueList[i].selected = selected
    }
  }
}])

.controller('VenuePromotionsIndexController', ['$scope', 'VenuePromotion', '$stateParams',
  function($scope, VenuePromotion, stateParams, session) {
    VenuePromotion.query({venue_id: stateParams.venue_id}).$promise
      .then(function(data){
        console.log("successfully queried venue promotions :: "+data);
        $scope.promotions = data;
      })
      .catch(function(data){
        console.log("error querying venues")
      });
}])
