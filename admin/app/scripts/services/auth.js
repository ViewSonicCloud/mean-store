'use strict';

/**
 * @ngdoc service
 * @name eCommerceAdminApp.Auth
 * @description
 * # Auth
 * Factory in the eCommerceAdminApp.
 */
angular.module('eCommerceAdminApp')
  .factory('sessionService', ['$cookieStore', function($cookieStore) {
    return {
      set: function(key, value) {
        return $cookieStore.put("admin_"+key, value);
      },
      get: function(key) {
        return $cookieStore.get("admin_"+key);
      },
      destroy: function(key) {
        return $cookieStore.remove("admin_"+key);
      }
    };
  }])
