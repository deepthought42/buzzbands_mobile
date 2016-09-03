var venueService = angular.module('buzzbands.venue.service', ['ngResource', 'buzzbands.serviceConfig']);

venueService.factory('Venue', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/venues/:id.json', {id: '@id'}, {
    update: { method: 'PUT'},
    getNearMe: {method: 'GET', isArray: true, url: config.basePath+'/venuesNearMe'}
  });
}]);

venueService.factory('VenuePromotion', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/venues/:venue_id/promotions',
    {venue_id: '@venue_id'},
    {
      update: { method: 'PUT'}
    });
}]);
