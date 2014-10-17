'use strict';

//Comments service used to communicate Traffics REST endpoints
angular.module('map').factory('Comments', ['$resource',
	function($resource) {
		return $resource('traffics/:trafficId/comments/:commentId', { 
			trafficId: '@trafficId', 
			commentId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);

// '@poemId', commentId: '@_id'
		