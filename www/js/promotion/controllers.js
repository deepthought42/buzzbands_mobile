angular.module('promotion.controllers', ['buzzbands.promotion.service'])

.config(['$stateProvider',
  function($stateProvider) {

    $stateProvider
      .state('tab.promotions', {
        url: 'promotions',
        views: {
          'tab-promotions': {
            templateUrl: 'templates/promotions/index.html',
            controller: 'PromotionIndexCtrl'
          }
        }
      })

      .state('tab.promotionDetails', {
        url: 'promotionDetails',
        views: {
          'tab-promotions': {
            templateUrl: 'templates/promotions/details.html',
            controller: 'PromotionDetailsCtrl'
          }
        },
        params: {
          promotion: null
        }
      });
    }
  ])

.controller('PromotionIndexCtrl',['$scope', '$stateParams', '$state', 'Promotion', '$location',
  function($scope, $stateParams, $state, Promotion, $location) {

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

    /**
     * Initialize PromotionIndexCtrl.
     */
    this.init = function(){
      $scope.promotionList = $scope.getPromotionList();

      $scope.rating = {};
      $scope.rating.rate = 3;
      $scope.rating.max = 5;

    };

    $scope.getPromotionList = function(){
      return Promotion.query();
    };

    $scope.goToPromotionDetails = function(promotion){
      console.log("promoitin; "+ promotion);
      $state.go("tab.promotionDetails", {"promotion": promotion});
    }

    this.init();
  }
])

.controller('PromotionDetailsCtrl',['$scope', '$stateParams', '$state', 'Promotion', 'Venue', '$location',
  function($scope, $stateParams, $state, Promotion, Venue, $location) {
    this._init = function(){
      $scope.promotion = $stateParams.promotion;
      console.log($scope.promotion);
      $scope.venue = Venue.get({venue_id: $scope.promotion.venue_id});

      console.log("PROMOTION :: " + $scope.promotion);
    }

    this._init();
  }
]);
