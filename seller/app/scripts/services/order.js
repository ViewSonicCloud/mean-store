'use strict';

/**
 * @ngdoc service
 * @name ecommercesellerApp.order
 * @description
 * # order
 * Service in the ecommercesellerApp.
 */
angular.module('ecommercesellerApp')
  .service('order', (['$resource','url','sellers','$window','auth', function($resource,url,sellers,$window,auth) {
    console.log("bbbbbbbbbbbbb");
    var main_url = url+sellers+"tracking/getStatus?status=:status";
    var authorization = $window.localStorage['Authorization'];
    console.log(auth);
    console.log("h")

    return $resource(main_url,{status:'@status'},{
    get: {
      method: 'GET',
      headers:{Authorization:auth.get()},
    }
  });
}]));
