'use strict';

// Traffics controller
angular.module('traffics').controller('TrafficsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Traffics',
	function($scope, $stateParams, $location, Authentication, Traffics ) {
		$scope.authentication = Authentication;

		// Create new Traffic
		$scope.create = function() {
			// Create new Traffic object
			var traffic = new Traffics ({
				title: this.name,
				content: this.post,

			});

			// Redirect after save
			traffic.$save(function(response) {
				$location.path('traffics/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Traffic
		$scope.remove = function( traffic ) {
			if ( traffic ) { traffic.$remove();

				for (var i in $scope.traffics ) {
					if ($scope.traffics [i] === traffic ) {
						$scope.traffics.splice(i, 1);
					}
				}
			} else {
				$scope.traffic.$remove(function() {
					$location.path('traffics');
				});
			}
		};

		// Update existing Traffic
		$scope.update = function() {
			var traffic = $scope.traffic ;

			traffic.$update(function() {
				$location.path('traffics/' + traffic._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Traffics
		$scope.find = function() {
			$scope.traffics = Traffics.query();
		};

		// Find existing Traffic
		$scope.findOne = function() {
			$scope.traffic = Traffics.get({ 
				trafficId: $stateParams.trafficId
			});
		};
	}
]);