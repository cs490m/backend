'use strict';

var app = angular.module('App',[]);
  
app.controller('MainController', ['$scope', '$location', '$timeout', '$http', function($scope, $location, $timeout, $http) {

    var host = "http://localhost:8080"
    var path = "/api/user_data";
    var url = host + path;
    $location.path("/view_data");

    $scope.$on('$locationChangeStart', function() {
        $scope.addData = $location.path() == '/add_data';
    });

    var exists = function(x) {
        return x != null && x != "";
    };
    
    $scope.submitData = function() {
        $scope.serverSuccess = false;
        $scope.serverError = false;
        var sensorData = {};
        sensorData.id = $scope.addId;
        sensorData.type = $scope.addType;
        sensorData.time = parseInt($scope.addTime);
        sensorData.value = $scope.addValue;
        console.log("Submitting request for data : ");
        console.log(sensorData);
        $scope.postRequest = "Sending POST path : " + path + " body: " + JSON.stringify([sensorData]);
        $scope.sendingRequest = true;
        $http({
            method: "POST",
            url: url,
            data: [sensorData]
        }).success(function(data){
            console.log("success, hurray. response:");
            console.log(data);
            $scope.response = data;
            $scope.serverSuccess = true;
        }).error(function(){
            console.log("fail..");
            console.log(data);
            $scope.response = data;
            $scope.serverError = true;
        })
    };

    $scope.getResults = function() {
        var getParams = {};
        if (exists($scope.getId))
            getParams.id = $scope.getId;
        if (exists($scope.getStartTime))
            getParams.start = $scope.getStartTime;
        if (exists($scope.getEndTime))
            getParams.end = $scope.getEndTime;
        if (exists($scope.getType))
            getParams.type = $scope.getType;
        $scope.getRequest = "GET : " + path + "&" + $.param(getParams);
        $scope.showGetInfo = true;
        $http({
            method: "GET",
            url: url,
            params: getParams
        }).success(function(data){
            console.log("success, hurray.");
            $scope.results = data;
        }).error(function(){
            console.log("fail..");
        })
    };
    
    $scope.clearResults = function() {
        $scope.results = [];
        $scope.showGetInfo = false;
        $scope.getId = null;
        $scope.getType = null;
        $scope.getStartTime = null;
        $scope.getEndTime = null;
    };

    $scope.disableAddDataButton = function() {
        var allFields = exists($scope.addId) && exists($scope.addType) && exists($scope.addTime) && exists($scope.addValue);
        return !allFields;
    };
}]);