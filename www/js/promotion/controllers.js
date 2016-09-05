angular.module('promotion.controllers', ['buzzbands.promotion.service'])

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
      $scope.promotionLoaded = true;
      $scope.promotionList = $scope.getPromotionList();

      $scope.rating = {};
      $scope.rating.rate = 3;
      $scope.rating.max = 5;

    };

    $scope.deletePromotion = function(id){
      Promotion.delete(id);
      $scope.promotionList = $scope.getPromotionList();
    };

    $scope.setMainAdLocation = function(ad_location){
      $scope.main_ad_location = ad_location;
    };

    $scope.getPromotionList = function(){
      return Promotion.query();
    };

    $scope.createPromotion = function(){
      $scope.promoPanel='create';
      //state.go("new@promotions.dashboard");
    };

    $scope.deletePromotions = function(){
      for(var i =0;i < $scope.promotionList.length; i++){
        if($scope.promotionList[i].selected){
          Promotion.delete({id:$scope.promotionList[i].id}).then(function(){
            $scope.promotionList = $scope.getPromotionList();
          })
          .catch(function(data){
            console.log("an error occurred while deleting promotion");
          });
        }
      }
    };

    $scope.goToPromotionDetails = function(promotion){
      $state.go("adminDashboard.viewPromotion", {"promotionId": id, "promotion": promotion})
    }

    this.init();
  }
])

.controller('PromotionDetailCtrl',['$scope', '$stateParams', '$state', 'Promotion', '$location',
  function($scope, $stateParams, $state, Promotion, $location) {

  }
]);
