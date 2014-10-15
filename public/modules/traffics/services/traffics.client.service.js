'use strict';

//Traffics service used to communicate Traffics REST endpoints
angular.module('traffics').factory('Traffics', ['$resource',
    function($resource) {
        return $resource('traffics/:trafficId', {
            trafficId: '@_id',
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);


//Comments service used to communicate Traffics REST endpoints
angular.module('traffics').factory('TrafficsComments', ['$resource',
    function($resource) {
        return $resource('/comments/:commentId', {
            // trafficId: '@traffic',

            commentId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);

angular.module('traffics').factory('Traffic', ['$resource',
    function($resource) {
        return $resource('traffics/:query', {
            query: '@query',
        }, {
            search: {
                method: 'GET',
                params: {
                    action: 'search',
                    query: '@query',
                    isArray: true
                }
            }
        });
    }
]);
