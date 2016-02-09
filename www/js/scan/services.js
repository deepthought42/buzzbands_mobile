var scanService = angular.module('buzzbands.scan.service', ['ngResource', 'buzzbands.serviceConfig']);

scanService.factory('Scan', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/scans/:id.json', {id: '@id'}, {
    update: { method: 'PUT'}
  });
}]);
