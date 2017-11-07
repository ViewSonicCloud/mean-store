'use strict';

/**
 * @ngdoc function
 * @name ecommercesellerApp.controller:AddProductCtrl
 * @description
 * # AddProductCtrl
 * Controller of the ecommercesellerApp
 */

angular.module('ecommercesellerApp')

  .controller('AddProductCtrl', ['$scope','$http','url','sellers','$window','$compile','$location','spinnerService','auth','Upload', function($scope,$http,url,sellers,$window,$compile,$location,spinnerService,auth,Upload) {

    var category_url = url+'api/v1/categories/get-approved-categories';
    var configurations = url +'api/v1/admin/settings';
    var cropped_url =url +'api/v1/images/upload-single-image';
    var license_url = url +'api/v1/licenses/';
    $('#cropped').prop('disabled', true);

    $scope.pricing_min=1;


    $scope.price_add_subtract =false;
    $scope.product_type=true;
    $scope.variant_toggle=true;
    $scope.enabled = true;
    $scope.onOff = true;
    $scope.yesNo = true;
    $scope.image_icon = true;
    $scope.image_message=false;
    $scope.product_error=false;
    $scope.submit=true;
    $scope.si="";
    $scope.paid_by = 0;
    $scope.subcategory_visible=false;
    $scope.cropArea=true;
    $scope.shipping_toggle=true;
    $scope.shipping_message="";
    $scope.price_add_subtract =false;
    $scope.myImage='';
    $scope.myCroppedImage='';
    $scope.images=[];
    $scope.video_url=[];
    $scope.choices = [];
    $scope.images =[];
    $scope.images_container =[];
    $scope.prices = [{
      "original": "",
      "after_discount": "",
      "commission": "",
      "service_tax": "",
      "savings": "",
      "error":"",
      "license":""
    }];
    $scope.video_url = [];

    $scope.add_prices = function($index) {

        $scope.prices
          .push({
            "original": "",
            "after_discount": "",
            "commission": "",
            "service_tax": "",
            "savings": "",
            "error":"",
            "license":""
          });
    };

    $scope.add_video_url = function(){
      $scope.video_url.push({"url":""});

     }

    $scope.addNewChoice = function() {

        $scope.choices.push({"name":"","quantity":"","original":"","after_discount":"","commission":"","service_tax":"","savings":"","error":""});
        console.log($scope.choices);
    };

    $scope.remove_prices = function($index) {
      $scope.prices.splice($index, 1);
    };
    $scope.removeChoice = function($index) {
      $scope.choices.splice($index,1);
    };

    $scope.removeVideoUrl = function($index) {
      $scope.video_url.splice($index,1);
    };

    $scope.remove_image =function($index){

      $scope.images.splice($index,1);
      if($scope.images.length <5){
          $scope.image_icon = true;
      }

    }

    $scope.isSelectionUsed = function(selection, currentPrice) {
      return $scope.prices.some(function(price) {
        return price !== currentPrice && price.license === selection._id
      });
    }

    $scope.visibility_toggle = function(){
      $scope.pricing_min=1;
      $scope.variant_toggle =true;
      $scope.prices = [{
        "original": "",
        "after_discount": "",
        "commission": "",
        "service_tax": "",
        "savings": "",
        "error":"",
        "license":""
      }];

      if($scope.product_type==false){

        $http.get(license_url).success(function(data){

            if(data['status']=='success'){
            $scope.licenseOptions = data['response'];
            $scope.license_length=$scope.licenseOptions.length;
            }
         });
         $scope.variant_toggle =false;
         $scope.shipping_toggle=false;
         $scope.price_add_subtract =true;
         $scope.shipping_message="Only Available In Physical Product";
         $scope.pricing_min=0;
      }
      console.log($scope.pricing_min);
    }


   var handleFileSelect=function(evt) {

     $('#cropped').prop('disabled', false);
     var file=evt.currentTarget.files[0];
     var reader = new FileReader();
     reader.onload = function (evt) {
       $scope.$apply(function($scope){
         $scope.myImage=evt.target.result;
         $scope.image_temp = $scope.myCroppedImage;

       });
     };
     reader.readAsDataURL(file);
   };
  angular.element(document.querySelector('#fileInput')).on('change',handleFileSelect);

   function urltoFile(url, filename, mimeType) {
         return (fetch(url)
           .then(function(res) {
             return res.arrayBuffer();
           })
           .then(function(buf) {
             return new File([buf], filename, {
               type: mimeType
             });
           })
         );
   }

   $scope.crop = function() {
     $scope.cropArea =false;
     spinnerService.show('booksSpinner');
     $('#cropped').prop('disabled', true);
         urltoFile($scope.myCroppedImage, 'a.png', 'image/png')
           .then(function(file) {
             var fd = new FormData();
             fd.append('image', file);
             $http.post(cropped_url, fd, {
                 transformRequest: angular.identity,
                 headers: {
                   'Content-Type': undefined
                 }
               })
               .success(function(data) {

                 spinnerService.hide('booksSpinner');
                 $scope.cropArea =true;
                 $scope.images.push(data.response);
                 $scope.myImage='';
                $scope.myCroppedImage='';
                $("html, body").animate({ scrollTop: $(document).height() }, 1000);
                if($scope.images.length ==4){
                    $scope.image_icon = false;
                }

               })
               .error(function(data, status) {
                 console.log(data);
               });
           })
       }





    //Fetching categories config
    $http.get(category_url).success(function(data){
        if(data['status']=='success'){
          $scope.category = data['response']['categories'];

        }
     });
     //Fetching setting config
     $http.get(configurations).success(function(data){
        if(data['status']=='success'){
          $scope.units = data['response']['units'];
          $scope.config_service_tax =data['response']['service_tax'];
          $scope.config_commission=data['response']['commission'];
          $scope.ships_in=data['response']['ships_in'];
          $scope.price_unit=data['response']['price_unit'];

        }
     });

      //Sku validation from server
    $scope.sku_msg =false;
    $scope.sku_check = function (){
            var sku_url = url+"api/v1/products/isexist";
            $http.post(sku_url,{"sku":$scope.sku}).success(function(data){
              if(data["response"]["flag"]==true){
                $scope.sku_msg =true;

              }else{
                $scope.sku_msg =false;
              }

             });

    }

    //Fetching sub category
     $scope.sub_category = function () {
       if($scope.cat ==0){
         return;
       }
       var category_url = url+'api/v1/categories/get-approved-categories?parent_id='+$scope.cat;
        $http.get(category_url).success(function(data){
            $scope.subcategory = data['response']['categories'];
            if($scope.subcategory[0].children.length !=0){
                $scope.subcategory_visible=true;
            }else{
                $scope.subcategory_visible=false;
            }
            $scope.sub_cat = "";

         });

     }

     $scope.submiting = function () {

       var type="normal";


      if($scope.product_type == false){
        var license_new = $scope.prices;
        var pricing_new =$scope.prices[0];


        var type="digital";
      }else{
        console.log( $scope.prices);
        var pricing_new = $scope.prices[0];
        var license_new=[];


      }

       if($scope.images.length ==0){
         $scope.image_message= true;
          return;
       }

       var variant_quantity =$scope.choices;
       var sum=0;
       angular.forEach(variant_quantity,function(v,k){
          sum = sum + parseInt(v["quantity"]);
        });

      if(parseInt($scope.quantity) < sum){
        $scope.product_error=true;
        $scope.error_message ="Quantity should be same As variant Quantities!!";
          $(window).scrollTop(0);
        return;
      }

       var new_url  = url+'api/v1/products/add-product';
       var authorization = $window.localStorage['Authorization'];

       var req = {
          method: 'POST',
          url: new_url,
          headers: {
              'Authorization':authorization
          },
          data: {"source":$scope.source,"product_videos":$scope.video_url,"type":type,"licenses":license_new,"pricing":pricing_new,"terms_and_conditions":$scope.terms_and_conditions,"long_description":$scope.long_description,"meta":$scope.meta,"unit":$scope.unit,"images":$scope.images,"variants":variant_quantity,"quantity":$scope.quantity,"title":$scope.name,"name":$scope.name,"category":$scope.cat,"subcategory":$scope.sub_cat,'description':$scope.description,"sku":$scope.sku,"price":$scope.main_price,"selling_price":$scope.selling_price,"commission":$scope.commision,"service_tax":$scope.service_tax,"weight":$scope.weight,"shipping_fee":$scope.shipping_fee,"ship_duration":$scope.ship_duration,"paid_by":$scope.paid_by}
        }
        $http(req).success(function(data){
            if(data.status =="success"){
                $scope.submit=false;
              alert("Product Added Successfully");
            $location.path('yet_to_be_approved');
            }else{
              alert("Sever Error Please Add Again");
            }
          }).error(function(data){
              console.log(data);
              $scope.product_error=true;
              $scope.error_message=data;
              $(window).scrollTop(0);

          });
        }


        $scope.upload = function (file) {
               Upload.upload({
                   url:  url+"api/v1/sources/upload",
                   data: {source: file}
               }).then(function (resp) {
                   $scope.source =resp.data.response._id;
               }, function (resp) {
                   console.log('Error status: ' + resp.status);
               }, function (evt) {
                   var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                  $scope.ProgressPercentage=progressPercentage;
                  $scope.ProgressPercentageValue = progressPercentage +"%";

               });
           };

    $scope.calculate_price = function ($index,selection) {

      console.log($index);
      var calculate_selection = $scope.prices;
      if(selection =='choices'){
        var calculate_selection = $scope.choices;
      }
      var original = calculate_selection[$index].original;

      var after_discount =calculate_selection[$index].after_discount;
      calculate_selection[$index].error="";
      if(after_discount){
        if(after_discount > original){
          calculate_selection[$index].error="Price after Discount should be less than Item Price";
          return;
        }
        var actual_commision =(calculate_selection[$index].after_discount*$scope.config_commission)/100;
        calculate_selection[$index].commission=actual_commision;
        var service_tax =(actual_commision*$scope.config_service_tax)/100;
        calculate_selection[$index].service_tax=service_tax;
        var savings = actual_commision+service_tax;
        savings = calculate_selection[$index].after_discount-savings;
        calculate_selection[$index].savings =savings;



      }else{

        var actual_commision =(calculate_selection[$index].original*$scope.config_commission)/100;
        calculate_selection[$index].commission=actual_commision;
        var service_tax =(actual_commision*$scope.config_service_tax)/100;
        calculate_selection[$index].service_tax=service_tax;
        var savings = actual_commision+service_tax;
        savings = calculate_selection[$index].original-savings;
        calculate_selection[$index].savings =savings;
      }
    }


  }]);
