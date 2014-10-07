'use strict';

//Setting up route
angular.module('traffics').config(['$stateProvider',
	function($stateProvider) {
		// Traffics state routing
		$stateProvider.
		state('listTraffics', {
			url: '/traffics',
			templateUrl: 'modules/traffics/views/list-traffics.client.view.html'
		}).
		state('createTraffic', {
			url: '/traffics/create',
			templateUrl: 'modules/traffics/views/create-traffic.client.view.html'
		}).
		state('viewTraffic', {
			url: '/traffics/:trafficId',
			templateUrl: 'modules/traffics/views/view-traffic.client.view.html'
		}).
		state('editTraffic', {
			url: '/traffics/:trafficId/edit',
			templateUrl: 'modules/traffics/views/edit-traffic.client.view.html'
		});
	}
]);