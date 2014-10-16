'use strict';


angular.module('core').controller('HomeController', ['$scope', 'Authentication', '$timeout', function($scope, Authentication, $timeout, ngAnimate, ngTouch) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.myInterval = 5000;

    // Set of Photos
    $scope.slides = [
'modules/core/img/trafficSignal.png',
'modules/core/img/trafficRoads.png'
];

// initial image index
$scope._Index = 0;


// if a current image is the same as requested image
$scope.isActive = function (index) {
return $scope._Index === index;
};

// show prev image
$scope.showPrev = function () {
$scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.slides.length - 1;
};


		// show next image
		$scope.showNext = function () {
			$scope._Index = ($scope._Index < $scope.slides.length - 1) ? ++$scope._Index : 0;
			$timeout($scope.showNext, $scope.myInterval);
		};
		
		$scope.loadSlides = function(){
			 //pass timeout as service in your controller
		
			$timeout($scope.showNext, $scope.myInterval);
		};
		
		
		$scope.loadSlides();
		
}]);
