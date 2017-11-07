'use strict';

/**
 * @ngdoc service
 * @name eCommerceAdminApp.main
 * @description
 * # main
 * Service in the eCommerceAdminApp.
 */
angular.module('eCommerceAdminApp')
  .service('main', ['$resource', 'endpoint', 'sessionService', function($resource, endpoint, sessionService) {
    return $resource(endpoint + "/statistics", {}, {
      "getStatistics": {
        method: "GET",
        headers: {"Authorization": sessionService.get("token")}
      }
    })
  }])
