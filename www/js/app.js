// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('hypedrive_mobile', ['ionic',
                                    'ngResource',
                                    'buzzbands.serviceConfig',
                                    'promotion.controllers',
                                    'settings.controllers',
                                    'scan.controllers',
                                    'buzzbands.venue.controllers',
                                    'buzzbands.venue.service',
                                    'ngCordova',
                                    'ngStorage',
                                    'geolocation.controllers'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {


    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }

  });
})

.config(['$stateProvider', '$urlRouterProvider',
function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
  .state('tab', {
    url: '/',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.scan', {
    url: 'scan',
    views: {
      "tab-scan": {
        templateUrl: 'templates/scan/index.html',
        controller: 'ScanCtrl'
      }
    }
  })

  .state('tab.settings', {
    url: 'settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/settings/index.html',
        controller: 'GeoCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/venues');

}]);
