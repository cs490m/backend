'use strict';

var app = angular.module('App',[]);
  
app.controller('MainController', ['$scope', '$location', '$timeout', '$http', function($scope, $location, $timeout, $http) {

    $location.path("/view_data");

    $scope.$on('$locationChangeStart', function() {
        $scope.addData = $location.path() == '/add_data';
    });

    var exists = function(x) {
        return x != null && x != "";
    };
    
    $scope.submitData = function() {
        var sensorData = {};
        sensorData.id = $scope.addId;
        sensorData.type = $scope.addType;
        sensorData.time = parseInt($scope.addTime);
        sensorData.value = $scope.addValue;
        console.log("Submitting request for data : ");
        console.log(sensorData);
        $http({
            method: "POST",
            url: "http://localhost:8080/api/user_data",
            data: sensorData
        }).success(function(data){
            console.log("success, hurray.");
            console.log(data);
        }).error(function(){
            console.log("fail..");
        })
    };

    $scope.getResults = function() {
        var getUrl = "http://localhost:8080/api/user_data";
        //getUrl += "/" + $scope.getId + "/" + $scope.getStartTime + "/" + $scope.getEndTime;
        var getParams = {};
        if (exists($scope.getId))
            getParams.id = $scope.getId;
        if (exists($scope.getStartTime))
            getParams.start = $scope.getStartTime;
        if (exists($scope.getEndTime))
            getParams.end = $scope.getEndTime;
        $http({
            method: "GET",
            url: getUrl,
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
    };

    $scope.disableAddDataButton = function() {
        var allFields = exists($scope.addId) && exists($scope.addType) && exists($scope.addTime) && exists($scope.addValue);
        return !allFields;
    };
}]);
