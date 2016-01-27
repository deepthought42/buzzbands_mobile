angular.module('promotion.controllers', ['buzzbands.promotion.service'])

.controller('PromotionIndexCtrl',['$scope', '$stateParams', 'Promotion',
  function($scope, $stateParams, Promotion) {

    /**
     * Initialize PromotionIndexCtrl.
     */
    this.init = function(){
      $scope.promotionLoaded = true;
      $scope.main_ad_location = promotions[0].ad_location;
      $scope.promotionList = $scope.getPromotionList();
    }

    $scope.editPromotion = function(id){
      state.go("adminDashboard.editPromotion", {"promotionId": id})
    }

    $scope.deletePromotion = function(id){
      Promotion.delete(id);
      $scope.promotionList = $scope.getPromotionList();
    }

    $scope.setMainAdLocation = function(ad_location){
      console.log("fml");
      $scope.main_ad_location = ad_location;
    }

    $scope.getPromotionList = function(){
      return Promotion.query();
    }

    $scope.createPromotion = function(){
      $scope.promoPanel='create';
      console.log("CREATE PROMOTION CICKED");
      //state.go("new@promotions.dashboard");
    }

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
    }

    this.init();
  }
])
