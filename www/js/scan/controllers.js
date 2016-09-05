angular.module('scan.controllers', ['buzzbands.scan.service'])
.controller('ScanAccessCtrl', function($scope, $cordovaBarcodeScanner, $ionicPlatform, $state) {
  $scope.openScanner = function(){
    $state.go('tab.scan');
  }
})
.controller('ScanCtrl', function($scope, $cordovaBarcodeScanner, Scan,
                                 $ionicPlatform, $state, $localStorage) {

  $scope.$on('$ionicView.enter', function() {

    document.addEventListener("deviceready", function () {
      //$cordovaGoogleAnalytics.startTrackerWithId('UA-000000-01');

      //$localStorage.venue_id = 2;
      //$state.go("tab.venuePromotions", { venue_id: '2' });
      //$localStorage.uuid = device.uuid;
      $scope.scan = function(){
         $ionicPlatform.ready(function() {
            $cordovaBarcodeScanner.scan().then(function(barcodeData) {
              // Success! Barcode data is here
              $scope.scanResults = "We got a barcode \n" +
              "Result: " + result.text + "\n" +
              "Format: " + result.format + "\n" +
              "Cancelled: " + result.cancelled;
              var scan = {'uuid': device.uuid, 'venue_id': result.text}
              Scan.save(scan);
              //$localStorage.venue_id = result.text;
              $state.go("tab.venuePromotions", { "venue_id": result.text });
               console.log(JSON.stringify(barcodeData));
            }, function(error) {
               alert(JSON.stringify(error));
            });
         });
      }
    });
  })


  $scope.scanResults = '';
})
