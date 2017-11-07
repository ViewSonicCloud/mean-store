'use strict';

/**
 * @ngdoc function
 * @name ecommercesellerApp.controller:SubscriptionCtrl
 * @description
 * # SubscriptionCtrl
 * Controller of the ecommercesellerApp
 */
angular.module('ecommercesellerApp')

  .controller('SubscriptionCtrl', ['$scope','$http','url','sellers','$window','$location','sellers_url', function($scope,$http,url,sellers,$window,$location,sellers_url) {
    var authorization = $window.localStorage['Authorization'];
    $scope.toggle_subscription= function(price,id){
    $window.localStorage['subscription_id']=$scope.subscriptions[id]._id;

    $scope.subscription_final_price =price;
    $("#final_val").val(price);
    $("#subscription_return_url").val(sellers_url+"#/subscriptionlist");
    }

    var configurations = url +'api/v1/subscriptions';
    $http.get(configurations).success(function(data){
       if(data['status']=='success'){
         $scope.subscriptions = data['response']

       }
    });
    var settings = url +'api/v1/admin/settings';
    $http.get(settings).success(function(data){
       if(data['status']=='success'){
        $("#paypal_mail").val(data['response']['payment_gateway'][0]['email']);


       }
    });


    var authorization = $window.localStorage['Authorization'];
    var main_url = url+sellers+"current-subscription";
    var req = {
       method: 'GET',
       url:main_url,
       headers: {
           'Authorization':authorization
       },
     }

     $http(req).then(function(data){

       if(data.data.status=="success"){

          $scope.current_subscription = data.data.response;
          if($scope.current_subscription.length ==0){
                $scope.subscription_plan=true;
          }else{
                $scope.subscription_plan=false;
          }

        }

     });


    $scope.submit = function(){
      var subcription_url="https://www.sandbox.paypal.com/cgi-bin/webscr";
      var req = {
          method: 'POST',
          url: subcription_url,
          headers: {
              'Authorization':authorization
          },
          data: {
            "is_active" :true
          }
        }
        $http(req).then(function(data){
            if(data.data.status =="success"){
            $("#"+id).remove();

            }else{
              alert("Server error");
            }
        });
    }
  }]).controller('SubscriptionListCtrl', ['$scope','$http','url','sellers','$window','$location','$routeParams', function($scope,$http,url,sellers,$window,$location,$routeParams) {

            var authorization = $window.localStorage['Authorization'];
            var bought_amount = $routeParams.amt;
            var payment_id=$routeParams.tx;
            var payment_gateway="paypal";
            var plan = $window.localStorage['subscription_id'];
            var main_url = url+sellers+"subscribe";
            var req = {
               method: 'POST',
               url:main_url,
               data:{
                 bought_amount:bought_amount,
                 payment_id:payment_id,
                 payment_gateway:payment_gateway,
                 plan:plan

               },
               headers: {
                   'Authorization':authorization
               },
             }
             $http(req).then(function(data){
               console.log(data);
               if(data.data.status=="success"){
                 $location.path('subscription');
                }
             });

    }]);
