'use strict';

/**
 * @ngdoc function
 * @name ecommercesellerApp.controller:EditProductCtrl
 * @description
 * # EditProductCtrl
 * Controller of the ecommercesellerApp
 */

angular.module('ecommercesellerApp')
  .controller('EditProductCtrl',['$scope','$http','url','sellers','$window','$routeParams','$compile','spinnerService','$location','auth','Upload', function($scope,$http,url,sellers,$window,$routeParams,$compile,spinnerService,$location,auth,Upload) {
    var authorization = $window.localStorage['Authorization'];
    $('#cropped').prop('disabled', true);
   var cropped_url =url +'api/v1/images/upload-single-image';
   $('#cropped').prop('disabled', true);
   $scope.myImage='';
   $scope.myCroppedImage='';
   $scope.product_update =false;
   $scope.image_message=false;
   $scope.product_error =false;
   $scope.cropArea=true;
   $scope.sku_msg =false;
   $scope.image_icon = true;
   $scope.images=[];
   $scope.choices = [];
   $scope.product_videos=[];
   $scope.add_prices = function($index) {
     $scope.prices
       .push({
         "original": "",
         "after_discount": "",
         "commission": "",
         "service_tax": "",
         "savings": "",
         "error":""
       });
   };
   $scope.add_video_url = function(){
     $scope.product_videos.push({"url":""});

    }
    $scope.addNewChoice = function() {

      $scope.variants.push({"name":"","quantity":"","original":"","after_discount":"","commission":"","service_tax":"","savings":"","error":""});
     };

   $scope.remove_prices = function($index) {
     $scope.prices.splice($index, 1);
   };

   $scope.removeVideoUrl = function($index) {
       $scope.product_videos.splice($index,1);
    };
    $scope.removeChoice = function($index) {
        $scope.variants.splice($index,1);
    };
    $scope.remove_image =function($index){
      $scope.images.splice($index,1);
      if($scope.images.length <5){
          $scope.image_icon = true;
      }
    }

   $scope.visibility_toggle = function(){
       $scope.variant_toggle =true;
       $scope.shipping_toggle=true;
       $scope.shipping_message="";
       if($scope.product_type==false){
         $scope.variant_toggle =false;
         $scope.shipping_toggle=false;
         $scope.price_add_subtract =true;
         $scope.shipping_message="Only Available In Physical Product";
       }
       var license_url = url +'api/v1/licenses/';
       $http.get(license_url).success(function(data){

           if(data['status']=='success'){
           $scope.licenseOptions = data['response'];
           $scope.license_length=$scope.licenseOptions.length;
           }
        });
     }
   $scope.isSelectionUsed = function(selection, currentPrice) {
       return $scope.prices.some(function(price) {
         return price !== currentPrice && price.license === selection._id
       });
     }

   var handleFileSelect=function(evt) {

    $('#cropped').prop('disabled', false);
    var file=evt.currentTarget.files[0];
    var reader = new FileReader();
    reader.onload = function (evt) {
      $scope.$apply(function($scope){
        $scope.myImage=evt.target.result;
        $scope.image_temp = $scope.myCroppedImage;
        console.log($scope.image_temp);

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
             var uploadUrl = url+"api/v1/sources/upload";
             $http.post(cropped_url, fd, {
                 transformRequest: angular.identity,
                 headers: {
                   'Content-Type': undefined
                 }
               })
               .success(function(data) {
                 console.log(data.response.url);
                 spinnerService.hide('booksSpinner');
                 $scope.cropArea =true;
                 $scope.images.push(data.response);
                 $scope.myImage='';
                $scope.myCroppedImage='';
                  $scope.image_icon = false;
                  if($scope.images.length ==4){
                      $scope.image_icon = false;
                  }else{
                    $scope.image_icon = true;
                  }

                  $("html, body").animate({ scrollTop: $(document).height() }, 1000);

               })
               .error(function(data, status) {
                 console.log(data);
               });
           })
       }

    if(!authorization){
        $location.path('signin');
    }
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



var configurations = url +'api/v1/admin/settings';
   $http.get(configurations).success(function(data){
      if(data['status']=='success'){
        $scope.units = data['response']['units'];
        $scope.config_service_tax =data['response']['service_tax'];
        $scope.config_commission=data['response']['commission'];
        $scope.ships_in=data['response']['ships_in'];
        $scope.price_unit=data['response']['price_unit'];


      }
   });

    var category_url = url+'api/v1/categories/get-approved-categories';
    $scope.si="";
    $scope.donglee ="";
    var new_url  = url+'api/v1/products/get-single-product/'+$routeParams.id;
    var authorization = $window.localStorage['Authorization'];
    var req = {
       method: 'Get',
       url: new_url,
       headers: {
           'Authorization': authorization
       }
     }
     $http(req).then(function(data){
         if(data.data.status =="success"){
           var license_url = url +'api/v1/licenses/';
           $http.get(license_url).success(function(data){

               if(data['status']=='success'){
               $scope.licenseOptions = data['response'];
               $scope.license_length=$scope.licenseOptions.length;
               }
            });

            $scope.product_details = data.data.response.product;

            $scope.product_type=data.data.response.product.type;



            if($scope.product_type =='digital'){
              $scope.product_type= false;
                $scope.price_add_subtract =true;
                 $scope.shipping_message="Only Available In Physical Product";

            }else{
              $scope.product_type= true;

            }
            $scope.prices =data.data.response.product.licenses;


            $scope.shipping_fee =data.data.response.product.shipping_details.fee;
            $scope.product_videos =data.data.response.product.product_videos;
            $scope.pricing =data.data.response.product.pricing;
            $scope.product_id=data.data.response.product._id;
            $scope.sku=data.data.response.product.sku;
            $scope.variants =data.data.response.product.variants;
            $scope.images = data.data.response.product.images;
            $scope.images_container =$scope.images;
            $scope.selected_unit =data.data.response.product.shipping_details.unit;
            $scope.selected_duration=data.data.response.product.shipping_details.duration;
            $scope.terms_and_conditions =data.data.response.product.terms_and_conditions;
            $scope.product_details.selected_categories = [];
            $scope.product_details.categories.forEach(function(item){
            $scope.product_details.selected_categories.push(item._id);



            })

            $scope.units.forEach(function(item) {
              if(item == $scope.selected_unit) {
                $scope.unit = item;

              }
            });
            $scope.ships_in.forEach(function(item) {
              if(item == $scope.selected_duration) {
                $scope.ship_duration = item;
                //$scope.test = $scope.selected_duration;
              }

            });


            $scope.product_details.selected_categories

            $http.get(category_url).success(function(data){
               if(data['status']=='success'){
                 $scope.category = data['response']['categories'];
                 $scope.category.forEach(function(item) {
                   if($scope.product_details.selected_categories.indexOf(item._id) !==-1) {
                     $scope.product_details.category = item._id;
                     $scope.sub_category();
                   }
                 })
               }
            });
            $scope.paid_by=data.data.response.product.paid_by_buyer;


         }  else{
           alert("no");
         }
     });


     $scope.submiting = function () {

       if($scope.images.length ==0){
         $scope.image_message= true;
          return;
       }
       if($scope.product_type == false){
         var license_new = $scope.prices;
         var pricing_new =$scope.prices[0];

         delete pricing_new.error;

          var type="digital";
       }else{

         var pricing_new = $scope.pricing;
         var license_new=[];

       }
       console.log(pricing_new);

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
       var product_id = $scope.product_id;
       var new_url  = url+'api/v1/products/update-product/'+product_id;
       var authorization = $window.localStorage['Authorization'];
       var source ="";
       if($scope.product_type == false){
         if($scope.source){
           var source = $scope.source;
         }else{
           var source=$scope.product_details.source._id;
         }
       }


      var req = {
          method: 'PUT',
          url: new_url,
          headers: {
              'Authorization':authorization
          },

          data: { "source": source,
                  "type":type,
                  "product_videos":$scope.product_videos,
                  "licenses":license_new,
                  "pricing":pricing_new,
                  "terms_and_conditions":$scope.product_details.terms_and_conditions,
                  "long_description":$scope.product_details.long_description,
                  "meta":$scope.product_details.meta,
                  "images":$scope.images,
                  "variants":$scope.variants,
                  "quantity":$scope.product_details.quantity,
                  "title":$scope.product_details.title,
                  "name":$scope.product_details.title,
                  "category":$scope.product_details.category,
                  "subcategory":$scope.product_details.sub_category,
                  'description':$scope.product_details.description,
                  "price":$scope.main_price,
                  "weight":$scope.product_details.shipping_details.weight,
                  "shipping_fee":$scope.shipping_fee,
                  "ship_duration":$scope.ship_duration,
                  "paid_by":$scope.paid_by
                }
        }
        $http(req).success(function(data){
            if(data.status =="success"){
              $scope.product_update =true;

            $(window).scrollTop(0);

            }else{
              alert("Server errror");
            }
        }).error(function(data){
          $scope.product_error=true;
          $scope.error_message=data;
          $(window).scrollTop(0);

        });

     }

     $scope.calculate_price = function ($index,selection) {

       console.log($index);
       var calculate_selection = $scope.prices;
       if(selection =='variants'){
         var calculate_selection = $scope.variants;
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
         var service_tax =(actual_commision*$scope.config_service_tax )/100;
         calculate_selection[$index].service_tax=service_tax;
         var savings = actual_commision+service_tax;
         savings = calculate_selection[$index].after_discount-savings;
         calculate_selection[$index].savings =savings;



       }else{
         var actual_commision =(calculate_selection[$index].original*$scope.config_commission)/100;
         calculate_selection[$index].commission=actual_commision;
         console.log(  calculate_selection[$index].commission);
         console.log("fff");
         var service_tax =(actual_commision*$scope.config_service_tax)/100;
         calculate_selection[$index].service_tax=service_tax;
         var savings = actual_commision+service_tax;
         savings = calculate_selection[$index].original-savings;
         calculate_selection[$index].savings =savings;
       }
     }

     $scope.calculate_prices = function () {

       var original = $scope.pricing.original;

       var after_discount =$scope.pricing.after_discount;
       $scope.pricing.error="";
       if(after_discount){
         if(after_discount > original){
           $scope.pricing.error="Price after Discount should be less than Item Price";
           return;
         }
         var actual_commision =($scope.pricing.after_discount*$scope.config_commission)/100;
         $scope.pricing.commission=actual_commision;
         var service_tax =(actual_commision*$scope.config_service_tax)/100;
         $scope.pricing.service_tax=service_tax;
         var savings = actual_commision+service_tax;
         savings = $scope.pricing.after_discount-savings;
         $scope.pricing.savings =savings;



       }else{

         var actual_commision =($scope.pricing.original*$scope.config_commission)/100;
         $scope.pricing.commission=actual_commision;
         var service_tax =(actual_commision*$scope.config_service_tax)/100;
         $scope.pricing.service_tax=service_tax;
         var savings = actual_commision+service_tax;
         savings = $scope.pricing.original-savings;
         $scope.pricing.savings =savings;
       }
     }

     $scope.sub_category = function () {

       if($scope.product_details.category ==0){
         return;
       }
       var category_url = url+'api/v1/categories/get-approved-categories?parent_id='+$scope.product_details.category;
        $http.get(category_url).success(function(data){
            $scope.subcategories = data['response']['categories'][0]["children"];
            if(data['response']['categories'][0]["children"].length ==0){
              $scope.subcategory_visible = false;
            }
            else{
              $scope.subcategory_visible = true;
            }

            $scope.subcategories.forEach(function(item){
              if($scope.product_details.selected_categories.indexOf(item._id) !==-1) {
                $scope.product_details.sub_category = item._id;
              }
            })

         });

     }
  }]).directive('fileModel', ['$parse', function ($parse) {
              return {
                 restrict: 'A',
                 link: function(scope, element, attrs) {
                    var model = $parse(attrs.fileModel);
                    var modelSetter = model.assign;

                    element.bind('change', function(){
                       scope.$apply(function(){
                          modelSetter(scope, element[0].files[0]);
                       });
                    });
                 }
              };
}]);
