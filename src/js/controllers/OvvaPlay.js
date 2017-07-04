"use strict";

app.controller('OvvaCatController', ['$scope', '$state', '$sce', '$stateParams', '$timeout', '$interval', 'OvvaCat', 'OvvaFrame',
  function($scope, $state, $sce, $stateParams, $timeout, $interval, OvvaCat, OvvaFrame) {
	
	$scope.ctg = OvvaCat.get();
	$scope.frm = OvvaFrame.get();
	/*var result = angular.fromJson($scope.chnl.data);*/
    $scope.video = $sce.trustAsResourceUrl('https://ovva.tv/video/embed/rGtEbD21?pl=1&l=ru');
	$scope.title = $stateParams.title;
	
	
	
	}
  
]);
