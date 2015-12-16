angular.module('promotion.controllers', [])

.controller('PromotionIndexCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})
