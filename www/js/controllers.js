angular.module('starter.controllers', [])

.controller('ScanCtrl', function($scope, $cordovaBarcodeScanner) {
  console.log("SCAN CTRL LOADED");
  document.addEventListener("deviceready", function () {
    $scope.scanBarcode = function(){
      $cordovaBarcodeScanner
      .scan()
      .then(function(barcodeData) {
        console.log("Success");
      }, function(error) {
        console.log("SCAN MAYBE?");
      });
    }
  });

})

.controller('VenueIndexCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('PromotionIndexCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
