'use strict';

// Setting up route
angular.module('core').config(['$stateProvider', '$urlRouterProvider',

    function($stateProvider, $urlRouterProvider) {
        // Redirect to home view when route not found
        $urlRouterProvider.otherwise('/');

        // Home state routing
        $stateProvider.
        state('home', {
            url: '/',
            templateUrl: 'modules/core/authentication/signin.client.view.html'
        }).
        state('map', {
            url: '/traffic',
            templateUrl: 'modules/core/views/map.client.view.html'
        });
    }
]);
