var services = angular.module('buzzbands.venue.service', ['ngResource', 'buzzbands.serviceConfig']);

services.factory('Venue', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/venues/:id.json', {id: '@id'}, {
    update: { method: 'PUT'}
  });
}]);
