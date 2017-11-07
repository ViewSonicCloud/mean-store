
'use strict';

/**
 * @ngdoc function
 * @name ecommercesellerApp.controller:SigninCtrl
 * @description
 * # SigninCtrl
 * Controller of the ecommercesellerApp
 */




angular.module('ecommercesellerApp')
  .controller('SigninCtrl', ['$scope','$http','$location','$window','url','sellers','$cookieStore','$routeParams', function($scope,$http,$location,$window,url,sellers,$cookieStore,$routeParams) {
      $scope.sign_checked = false;
      $scope.error_message=false;
      $scope.email="awretail47@gmail.com ";
      $scope.password="Provenlogic@";

      setTimeout(function() {

      $('#mydiv').fadeOut('fast');
    }, 3000);

      if($routeParams.id){
        var url_check ="http://the-symbol.net:3000/api/v1/sellers/confirm/"+$routeParams.id;
        $http.get(url_check).success(function(data){
             $scope.sign_checked = true;
             $scope.status = data['status']=='success' ? "success": "danger";
             $scope.signin_message = data["statusMessage"];

        });


      }

      var configurations = url +'api/v1/admin/settings';
      $http.get(configurations).success(function(data){
         if(data['status']=='success'){
           console.log(data['response']['fav_icon']['url']);

           $scope.favicon=data['response']['fav_icon']['url'];


         }
      });
    if($window.localStorage['sign_in_check'] == 'true'){
        $scope.sign_checked = true;
        $scope.status = "success";
        $scope.signin_message ="Great! Please sign-in to start selling Note: - A verification email has been sent to your registered email ID.- You can start uploading products. But only after verification will your shop go live. This step is essential for critical sales emails to reach you on time. Everytime.";

    }else{
        $scope.sign_checked = false;
    }
    if($window.localStorage["forgot_password"]=='true'){
      $scope.sign_checked = true;
      $scope.signin_message ="Please check your Email";
    }


    $scope.submit = function () {

      $window.localStorage['sign_in_check'] = "false";
      $window.localStorage['forgot_password'] = 'false';
      var main_url = url+sellers+"login";
      $http.post(main_url,{"email":$scope.email,"password":$scope.password}).success(function(data){
        if (data['status'] == 'success') {
          console.log(data['response']['status']);
          console.log("f");
          if(data['response']['status']==false){
            alert("You have been Decativated By Admin. Please contact to Admin.");
            return;
          }
           $window.localStorage['Authorization']=data['response']['token'];
           $scope.favicon ="images/main.png";
            $location.path('/yet_to_be_approved');
        }else{
          if(data["statusCode"]==500){
            alert(data["statusMessage"]);
          }else{
              alert("Server Error");
          }
        }
      });

    }


  }]);
