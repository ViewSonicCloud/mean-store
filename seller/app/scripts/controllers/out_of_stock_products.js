'use strict';

/**
 * @ngdoc function
 * @name ecommercesellerApp.controller:OutOfStockProductsCtrl
 * @description
 * # OutOfStockProductsCtrl
 * Controller of the ecommercesellerApp
 */
angular.module('ecommercesellerApp')
  .controller('OutOfStockProductsCtrl', ['$scope','$http','url','sellers','$window','$location','user_url', function($scope,$http,url,sellers,$window,$location,user_url) {

    var authorization = $window.localStorage['Authorization'];

    if(!authorization){
        $location.path('signin');
    }
    var inactive_product = url+sellers+"products/out-of-stock";

    var authorization = $window.localStorage['Authorization'];

    $scope.edit_single_product = function(id) {
       $location.path('/edit_product/'+id);
    }

    var req = {
       method: 'GET',
       url:inactive_product,
       headers: {
           'Authorization':authorization
       },
     }
     $http(req).then(function(data){

       $scope.out_of_stock_product=data.data.response.products;
       $scope.user_url=user_url;

     });
  }]);
