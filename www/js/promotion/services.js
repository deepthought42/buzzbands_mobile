var promotionService = angular.module('buzzbands.promotion.service', ['ngResource', 'buzzbands.serviceConfig']);

promotionService.factory('Promotion', ['$resource', 'buzzbands.serviceConfig', function ($resource, config) {
  return $resource(config.basePath + '/promotions/:id.json', {id: '@id'}, {
    update: { method: 'PUT'}
  });
}]);
