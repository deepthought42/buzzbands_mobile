'use strict';

angular.module('buzzbands.VenueControllers', ['buzzbands.VenueService'])

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
    /*.state('tab.venues', {
      url: '/venues',
      templateUrl: 'templates/venues/index.html',
      controller: 'VenueIndexController'
    });*/
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
