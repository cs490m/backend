'use strict';

var app = angular.module('App',[]);
  
app.controller('MainController', ['$scope', '$location', '$timeout', function($scope, $location, $timeout) {

    $scope.results = [];
    $scope.dummyData = [];
    $scope.dummyData[0] = {'uid':'1234', 'type':'gps', 'timestamp':'000000', 'value':'47.676658, -122.305773'};
    $scope.dummyData[1] = {'uid':'1234', 'type':'gps', 'timestamp':'000002', 'value':'47.676868, -122.302373'};
    $scope.dummyData[2] = {'uid':'1234', 'type':'gps', 'timestamp':'000012', 'value':'47.635678, -122.305323'};
    $scope.dummyData[3] = {'uid':'1234', 'type':'gps', 'timestamp':'000023', 'value':'47.675638, -122.323773'};
    
    $scope.getResults = function() {
        $scope.results = $scope.dummyData;
    };
    
    $scope.clearResults = function() {
        $scope.results = [];
    };
	
}]);
