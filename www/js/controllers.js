angular.module('starter.controllers', [])

.controller('ScanCtrl', function($scope, $cordovaBarcodeScanner, $ionicPlatform) {
  console.log("SCANNER CONTROLLER LOADED");
  document.addEventListener("deviceready", function () {

    $scope.scan = function(){
      $scope.status = "scanning";

          $cordovaBarcodeScanner
          .scan()
          .then(function(result) {
              // Success! Barcode data is here
              vm.scanResults = "We got a barcoden" +
              "Result: " + result.text + "n" +
              "Format: " + result.format + "n" +
              "Cancelled: " + result.cancelled;
          }, function(error) {
              // An error occurred
              vm.scanResults = 'Error: ' + error;
          });
      }
    }, false);

  $scope.scanResults = '';
})

.controller('PromotionIndexCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('SettingCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
