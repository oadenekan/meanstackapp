'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$http', '$location', 'Authentication', '$timeout',
    function($scope, $http, $location, Authentication, $timeout) {
            // This provides Authentication context.
        $scope.authentication = Authentication;
          $scope.myInterval = 5000;

        // If user is signed in then direct to app page
        if ($scope.authentication.user) $location.path('/traffic');

        $scope.signup = function() {
            $http.post('/auth/signup', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/traffic');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

        $scope.signin = function() {
            $http.post('/auth/signin', $scope.credentials).success(function(response) {
                // If successful we assign the response to the global user model
                $scope.authentication.user = response;

                // And redirect to the index page
                $location.path('/traffic');
            }).error(function(response) {
                $scope.error = response.message;
            });
        };

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
    }
]);
