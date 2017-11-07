'use strict';

/**
 * @ngdoc function
 * @name eCommerceAdminApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the eCommerceAdminApp
 */
angular.module('eCommerceAdminApp')
  .controller('MainCtrl', ['main', "$scope", "$location", "sessionService", function(Main, $scope, $location, sessionService) {
    var _this = this;
    _this.title = "View Statistics";
    Main.getStatistics({}, {}, function(data) {
      console.log(data);
      if (data.status == "success") {

        _this.statistics = data.response;
      } else {
        _this.notify = {
          message: data.statusMessage,
          status: data.status,
          type: "danger"
        }
      }
    }, function(data) {
      _this.notify = {
        message: data.statusText,
        status: data.status,
        type: "danger"
      }
    });
  }])
