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

//Traffics service used to communicate Traffics REST endpoints
angular.module('traffics').factory('TrafficsComments', ['$resource',
    function($resource) {
        return $resource('traffics/:trafficId/comments/:commentId', {
            commentId: '@_id',
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);