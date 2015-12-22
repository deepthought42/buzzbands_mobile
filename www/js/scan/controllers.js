angular.module('scan.controllers', [])
.controller('ScanAccessCtrl', function($scope, $cordovaBarcodeScanner, $ionicPlatform, $state) {
  $scope.openScanner = function(){
    $state.go('tab.scan');
  }
})
.controller('ScanCtrl', function($scope, $cordovaBarcodeScanner, $ionicPlatform, $state) {
  $scope.$on('$ionicView.enter', function() {
    document.addEventListener("deviceready", function () {

      $cordovaBarcodeScanner
        .scan()
        .then(function(result) {
            // Success! Barcode data is here
            $scope.scanResults = "We got a barcode \n" +
            "Result: " + result.text + "\n" +
            "Format: " + result.format + "\n" +
            "Cancelled: " + result.cancelled;

            //alert(result.text);
            $state.go("tab.venuePromotions", { venue_id: result.text });
        }, function(error) {
            // An error occurred
            $scope.scanResults = 'Error: ' + error;
        });
    });
  })
  $state.go("tab.venuePromotions", { venue_id: 9});

  $scope.scanResults = '';
})
