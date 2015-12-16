angular.module('scan.controllers', [])

.controller('ScanCtrl', function($scope, $cordovaBarcodeScanner, $ionicPlatform, $state) {
  console.log("SCANNER CONTROLLER LOADED");
  document.addEventListener("deviceready", function () {
    $scope.status = "scanning";

    $cordovaBarcodeScanner
      .scan()
      .then(function(result) {
          // Success! Barcode data is here
          $scope.scanResults = "We got a barcoden" +
          "Result: " + result.text + "n" +
          "Format: " + result.format + "n" +
          "Cancelled: " + result.cancelled;

          alert($scope.scanResults);
          $state.go( "venue-promotions", $scope.scanResults );
      }, function(error) {
          // An error occurred
          $scope.scanResults = 'Error: ' + error;
      });
  });

  $scope.scanResults = '';
})
