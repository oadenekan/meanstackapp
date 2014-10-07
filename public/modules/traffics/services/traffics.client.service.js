'use strict';

//Traffics service used to communicate Traffics REST endpoints
angular.module('traffics').factory('Traffics', ['$resource',
	function($resource) {
		return $resource('traffics/:trafficId', { trafficId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);