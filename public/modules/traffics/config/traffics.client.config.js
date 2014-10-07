'use strict';

// Configuring the Articles module
angular.module('traffics').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Traffics', 'traffics', 'dropdown', '/traffics(/create)?');
		Menus.addSubMenuItem('topbar', 'traffics', 'List Traffics', 'traffics');
		Menus.addSubMenuItem('topbar', 'traffics', 'New Traffic', 'traffics/create');
	}
]);