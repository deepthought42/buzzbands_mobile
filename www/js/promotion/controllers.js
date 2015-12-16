angular.module('promotion.controllers', ['buzzbands.promotion.service'])

.controller('PromotionIndexCtrl', function($scope, $stateParams, Promotion) {
  $scope.promotions = ['No promotions yet'];
})
