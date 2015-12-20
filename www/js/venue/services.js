var venueService = angular.module('buzzbands.venue.service', ['ngResource', 'buzzbands.serviceConfig']);

venueService.factory('Venue', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/venues/:id.json', {id: '@id'}, {
    update: { method: 'PUT'}
  });
}]);

venueService.factory('VenuePromotion', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/venues/:venue_id/promotions/:promotion_id.json',
    {venue_id: '@venue_id', promotion_id: '@promotion_id'},
    {
      update: { method: 'PUT'}
    });
}]);
