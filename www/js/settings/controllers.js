angular.module('settings.controllers', [])

.controller('SettingCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
