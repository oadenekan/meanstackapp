'use strict';
// Init the application configuration module for AngularJS application
var ApplicationConfiguration = function () {
    // Init module configuration options
    var applicationModuleName = 'trafficupdate';
    var applicationModuleVendorDependencies = [
        'ngResource',
        'ngCookies',
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'ui.utils'
      ];
    // Add a new vertical module
    var registerModule = function (moduleName, dependencies) {
      // Create angular module
      angular.module(moduleName, dependencies || []);
      // Add the module to the AngularJS configuration file
      angular.module(applicationModuleName).requires.push(moduleName);
    };
    return {
      applicationModuleName: applicationModuleName,
      applicationModuleVendorDependencies: applicationModuleVendorDependencies,
      registerModule: registerModule
    };
  }();'use strict';
//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);
// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config([
  '$locationProvider',
  function ($locationProvider) {
    $locationProvider.hashPrefix('!');
  }
]);
//Then define the init function for starting up the application
angular.element(document).ready(function () {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_')
    window.location.hash = '#!';
  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('core');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('map');'use strict';
// Use applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('traffics');'use strict';
// Use Applicaion configuration module to register a new module
ApplicationConfiguration.registerModule('users');'use strict';
// Setting up route
angular.module('core').config([
  '$stateProvider',
  '$urlRouterProvider',
  function ($stateProvider, $urlRouterProvider) {
    // Redirect to home view when route not found
    $urlRouterProvider.otherwise('/');
    // Home state routing
    $stateProvider.state('home', {
      url: '/',
      templateUrl: 'modules/core/authentication/signin.client.view.html'
    }).state('map', {
      url: '/traffic',
      templateUrl: 'modules/core/views/map.client.view.html'
    });
  }
]);'use strict';
angular.module('core').controller('HeaderController', [
  '$scope',
  'Authentication',
  'Menus',
  function ($scope, Authentication, Menus) {
    $scope.authentication = Authentication;
    $scope.isCollapsed = false;
    $scope.menu = Menus.getMenu('topbar');
    $scope.toggleCollapsibleMenu = function () {
      $scope.isCollapsed = !$scope.isCollapsed;
    };
    // Collapsing the menu after navigation
    $scope.$on('$stateChangeSuccess', function () {
      $scope.isCollapsed = false;
    });
  }
]);'use strict';
angular.module('core').controller('HomeController', [
  '$scope',
  'Authentication',
  function ($scope, Authentication) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
  }
]);'use strict';
// map controller
angular.module('map').controller('mapController', [
  '$scope',
  '$http',
  '$stateParams',
  'Traffics',
  'TrafficsComments',
  function ($scope, $http, $stateParams, Traffics, TrafficsComments) {
    $scope.map = null;
    $scope.marker = null;
    $scope.currentPosition = null;
    $scope.geocoder = null;
    $scope.getLocation = function () {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
          $scope.showPosition(position);
        });
      } else {
        alert('Geolocation is not supported by this browser.');
      }
    };
    $scope.showPosition = function (position) {
      $scope.loadMap(position.coords);
      $scope.currentPosition = position.coords;
    };
    $scope.loadMap = function (coordinates) {
      $scope.directionsDisplay = new google.maps.DirectionsRenderer();
      $scope.geocoder = new google.maps.Geocoder();
      //map properties
      var mapOptions = {
          zoom: 15,
          center: new google.maps.LatLng(coordinates.latitude, coordinates.longitude),
          mapTypeId: google.maps.MapTypeId.HYBRID,
          panControl: true,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true,
          streetViewControl: true,
          overviewMapControl: true,
          rotateControl: true
        };
      //creating and displaying map on the page
      $scope.map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
      //putting marker to indicate the current position and its properties
      $scope.marker = new google.maps.Marker({
        position: mapOptions.center,
        animation: google.maps.Animation.BOUNCE
      });
      $scope.marker.setMap($scope.map);
      // Zoom to 15 when clicking on marker
      google.maps.event.addListener($scope.marker, 'click', function () {
        $scope.map.setZoom(15);
        $scope.map.setCenter($scope.marker.getPosition());
      });
      google.maps.event.addListener($scope.map, 'center_changed', function () {
        window.setTimeout(function () {
          $scope.map.panTo($scope.marker.getPosition());
        }, 40000);
      });
    };
    $scope.initializeSearch = function () {
      var address = document.getElementById('searchBox');
      var autocomplete = new google.maps.places.Autocomplete(address);
      autocomplete.setTypes(['address']);
      google.maps.event.addListener(autocomplete, 'place_changed', function () {
        var place = autocomplete.getPlace();
        if (!place.geometry) {
          return;
        }
        $scope.location = place.formatted_address;
        var address = '';
        if (place.address_components) {
          address = [
            place.address_components[0] && place.address_components[0].short_name || '',
            place.address_components[1] && place.address_components[1].short_name || '',
            place.address_components[2] && place.address_components[2].short_name || ''
          ].join(' ');
        }
      });
    };
    $scope.initializeSearch();
    $scope.fetchSearch = function () {
      $scope.geocoder = new google.maps.Geocoder();
      $scope.address = $scope.location;
      $scope.geocoder.geocode({ 'address': $scope.address }, function (results) {
        var newLat = results[0].geometry.location.lat();
        var newLng = results[0].geometry.location.lng();
        var mapOptions = {
            zoom: 5,
            center: new google.maps.LatLng(newLat, newLng)
          };
        $scope.marker = new google.maps.Marker({
          position: mapOptions.center,
          animation: google.maps.Animation.BOUNCE
        });
        $scope.marker.setMap($scope.map);
        $scope.map.setCenter($scope.marker.getPosition());
        var lat = results[0].geometry.location.lat();
        var lng = results[0].geometry.location.lng();
        var latlng = lat + ', ' + lng;
      });
      $scope.checkLocation($scope.address);
    };
    // This function checks the database to see if this location exists
    $scope.checkLocation = function (locale) {
      $scope.place = Traffics.query({ location: locale }, function (data) {
        if (data.length > 0) {
          $scope.traffic = data[0];
          $scope.findComments();
        } else {
          var traffics = new Traffics({ location: locale });
          traffics.$save(function (res) {
            $scope.traffic = res;
            $scope.findComments();
          });
        }
      });
    };
    $scope.createComment = function () {
      var comment = new TrafficsComments({ body: $scope.comment });
      comment.$save({ trafficId: $scope.traffic._id }, function (response) {
        $scope.comments = response.comments;
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    $scope.findComments = function () {
      $scope.comments = TrafficsComments.query({ trafficId: $scope.traffic._id });
    };
  }
]);'use strict';
//Menu service used for managing  menus
angular.module('core').service('Menus', [function () {
    // Define a set of default roles
    this.defaultRoles = ['*'];
    // Define the menus object
    this.menus = {};
    // A private function for rendering decision 
    var shouldRender = function (user) {
      if (user) {
        if (!!~this.roles.indexOf('*')) {
          return true;
        } else {
          for (var userRoleIndex in user.roles) {
            for (var roleIndex in this.roles) {
              if (this.roles[roleIndex] === user.roles[userRoleIndex]) {
                return true;
              }
            }
          }
        }
      } else {
        return this.isPublic;
      }
      return false;
    };
    // Validate menu existance
    this.validateMenuExistance = function (menuId) {
      if (menuId && menuId.length) {
        if (this.menus[menuId]) {
          return true;
        } else {
          throw new Error('Menu does not exists');
        }
      } else {
        throw new Error('MenuId was not provided');
      }
      return false;
    };
    // Get the menu object by menu id
    this.getMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      return this.menus[menuId];
    };
    // Add new menu object by menu id
    this.addMenu = function (menuId, isPublic, roles) {
      // Create the new menu
      this.menus[menuId] = {
        isPublic: isPublic || false,
        roles: roles || this.defaultRoles,
        items: [],
        shouldRender: shouldRender
      };
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenu = function (menuId) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Return the menu object
      delete this.menus[menuId];
    };
    // Add menu item object
    this.addMenuItem = function (menuId, menuItemTitle, menuItemURL, menuItemType, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Push new menu item
      this.menus[menuId].items.push({
        title: menuItemTitle,
        link: menuItemURL,
        menuItemType: menuItemType || 'item',
        menuItemClass: menuItemType,
        uiRoute: menuItemUIRoute || '/' + menuItemURL,
        isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].isPublic : isPublic,
        roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].roles : roles,
        position: position || 0,
        items: [],
        shouldRender: shouldRender
      });
      // Return the menu object
      return this.menus[menuId];
    };
    // Add submenu item object
    this.addSubMenuItem = function (menuId, rootMenuItemURL, menuItemTitle, menuItemURL, menuItemUIRoute, isPublic, roles, position) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === rootMenuItemURL) {
          // Push new submenu item
          this.menus[menuId].items[itemIndex].items.push({
            title: menuItemTitle,
            link: menuItemURL,
            uiRoute: menuItemUIRoute || '/' + menuItemURL,
            isPublic: isPublic === null || typeof isPublic === 'undefined' ? this.menus[menuId].items[itemIndex].isPublic : isPublic,
            roles: roles === null || typeof roles === 'undefined' ? this.menus[menuId].items[itemIndex].roles : roles,
            position: position || 0,
            shouldRender: shouldRender
          });
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeMenuItem = function (menuId, menuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        if (this.menus[menuId].items[itemIndex].link === menuItemURL) {
          this.menus[menuId].items.splice(itemIndex, 1);
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    // Remove existing menu object by menu id
    this.removeSubMenuItem = function (menuId, submenuItemURL) {
      // Validate that the menu exists
      this.validateMenuExistance(menuId);
      // Search for menu item to remove
      for (var itemIndex in this.menus[menuId].items) {
        for (var subitemIndex in this.menus[menuId].items[itemIndex].items) {
          if (this.menus[menuId].items[itemIndex].items[subitemIndex].link === submenuItemURL) {
            this.menus[menuId].items[itemIndex].items.splice(subitemIndex, 1);
          }
        }
      }
      // Return the menu object
      return this.menus[menuId];
    };
    //Adding the topbar menu
    this.addMenu('topbar');
  }]);'use strict';
// Configuring the Articles module
angular.module('traffics').run([
  'Menus',
  function (Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', 'Traffics', 'traffics', 'dropdown', '/traffics(/create)?');
    Menus.addSubMenuItem('topbar', 'traffics', 'List Traffics', 'traffics');
    Menus.addSubMenuItem('topbar', 'traffics', 'New Traffic', 'traffics/create');
  }
]);'use strict';
//Setting up route
angular.module('traffics').config([
  '$stateProvider',
  function ($stateProvider) {
    // Traffics state routing
    $stateProvider.state('listTraffics', {
      url: '/traffics',
      templateUrl: 'modules/traffics/views/list-traffics.client.view.html'
    }).state('createTraffic', {
      url: '/traffics/create',
      templateUrl: 'modules/traffics/views/create-traffic.client.view.html'
    }).state('viewTraffic', {
      url: '/traffics/:trafficId',
      templateUrl: 'modules/traffics/views/view-traffic.client.view.html'
    }).state('editTraffic', {
      url: '/traffics/:trafficId/edit',
      templateUrl: 'modules/traffics/views/edit-traffic.client.view.html'
    });
  }
]);'use strict';
// Traffics controller
angular.module('traffics').controller('TrafficsController', [
  '$scope',
  '$stateParams',
  '$location',
  'Authentication',
  'Traffics',
  function ($scope, $stateParams, $location, Authentication, Traffics) {
    $scope.authentication = Authentication;
    // Create new Traffic
    $scope.create = function () {
      // Create new Traffic object
      var traffic = new Traffics({
          title: this.name,
          content: this.post
        });
      // Redirect after save
      traffic.$save(function (response) {
        $location.path('traffics/' + response._id);
        // Clear form fields
        $scope.name = '';
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Remove existing Traffic
    $scope.remove = function (traffic) {
      if (traffic) {
        traffic.$remove();
        for (var i in $scope.traffics) {
          if ($scope.traffics[i] === traffic) {
            $scope.traffics.splice(i, 1);
          }
        }
      } else {
        $scope.traffic.$remove(function () {
          $location.path('traffics');
        });
      }
    };
    // Update existing Traffic
    $scope.update = function () {
      var traffic = $scope.traffic;
      traffic.$update(function () {
        $location.path('traffics/' + traffic._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
    // Find a list of Traffics
    $scope.find = function () {
      $scope.traffics = Traffics.query();
    };
    // Find existing Traffic
    $scope.findOne = function () {
      $scope.traffic = Traffics.get({ trafficId: $stateParams.trafficId });
    };
  }
]);'use strict';
//Comments service used to communicate Traffics REST endpoints
angular.module('map').factory('Comments', [
  '$resource',
  function ($resource) {
    return $resource('traffics/:trafficId/comments/:commentId', {
      trafficId: '@trafficId',
      commentId: '@_id'
    }, { update: { method: 'PUT' } });
  }
]);  // '@poemId', commentId: '@_id'
'use strict';
//Traffics service used to communicate Traffics REST endpoints
angular.module('traffics').factory('Traffics', [
  '$resource',
  function ($resource) {
    return $resource('traffics/:trafficId', { trafficId: '@_id' }, { update: { method: 'PUT' } });
  }
]);
//Traffics service used to communicate Traffics REST endpoints
angular.module('traffics').factory('TrafficsComments', [
  '$resource',
  function ($resource) {
    return $resource('traffics/:trafficId/comments/:commentId', { commentId: '@_id' }, { update: { method: 'PUT' } });
  }
]);'use strict';
// Config HTTP Error Handling
angular.module('users').config([
  '$httpProvider',
  function ($httpProvider) {
    // Set the httpProvider "not authorized" interceptor
    $httpProvider.interceptors.push([
      '$q',
      '$location',
      'Authentication',
      function ($q, $location, Authentication) {
        return {
          responseError: function (rejection) {
            switch (rejection.status) {
            case 401:
              // Deauthenticate the global user
              Authentication.user = null;
              // Redirect to signin page
              $location.path('signin');
              break;
            case 403:
              // Add unauthorized behaviour 
              break;
            }
            return $q.reject(rejection);
          }
        };
      }
    ]);
  }
]);'use strict';
// Setting up route
angular.module('users').config([
  '$stateProvider',
  function ($stateProvider) {
    // Users state routing
    $stateProvider.state('profile', {
      url: '/settings/profile',
      templateUrl: 'modules/users/views/settings/edit-profile.client.view.html'
    }).state('password', {
      url: '/settings/password',
      templateUrl: 'modules/users/views/settings/change-password.client.view.html'
    }).state('accounts', {
      url: '/settings/accounts',
      templateUrl: 'modules/users/views/settings/social-accounts.client.view.html'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'modules/users/views/authentication/signup.client.view.html'
    }).state('signin', {
      url: '/signin',
      templateUrl: 'modules/users/views/authentication/signin.client.view.html'
    }).state('forgot', {
      url: '/password/forgot',
      templateUrl: 'modules/users/views/password/forgot-password.client.view.html'
    }).state('reset-invlaid', {
      url: '/password/reset/invalid',
      templateUrl: 'modules/users/views/password/reset-password-invalid.client.view.html'
    }).state('reset-success', {
      url: '/password/reset/success',
      templateUrl: 'modules/users/views/password/reset-password-success.client.view.html'
    }).state('reset', {
      url: '/password/reset/:token',
      templateUrl: 'modules/users/views/password/reset-password.client.view.html'
    });
  }
]);'use strict';
angular.module('users').controller('AuthenticationController', [
  '$scope',
  '$http',
  '$location',
  'Authentication',
  '$timeout',
  function ($scope, $http, $location, Authentication, $timeout) {
    // This provides Authentication context.
    $scope.authentication = Authentication;
    $scope.myInterval = 5000;
    // If user is signed in then direct to app page
    if ($scope.authentication.user)
      $location.path('/traffic');
    $scope.signup = function () {
      $http.post('/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/traffic');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    $scope.signin = function () {
      $http.post('/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;
        // And redirect to the index page
        $location.path('/traffic');
      }).error(function (response) {
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
      $scope._Index = $scope._Index > 0 ? --$scope._Index : $scope.slides.length - 1;
    };
    // show next image
    $scope.showNext = function () {
      $scope._Index = $scope._Index < $scope.slides.length - 1 ? ++$scope._Index : 0;
      $timeout($scope.showNext, $scope.myInterval);
    };
    $scope.loadSlides = function () {
      //pass timeout as service in your controller
      $timeout($scope.showNext, $scope.myInterval);
    };
    $scope.loadSlides();
  }
]);'use strict';
angular.module('users').controller('PasswordController', [
  '$scope',
  '$stateParams',
  '$http',
  '$location',
  'Authentication',
  function ($scope, $stateParams, $http, $location, Authentication) {
    $scope.authentication = Authentication;
    //If user is signed in then redirect back home
    if ($scope.authentication.user)
      $location.path('/');
    // Submit forgotten password account id
    $scope.askForPasswordReset = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/forgot', $scope.credentials).success(function (response) {
        // Show user success message and clear form
        $scope.credentials = null;
        $scope.success = response.message;
      }).error(function (response) {
        // Show user error message and clear form
        $scope.credentials = null;
        $scope.error = response.message;
      });
    };
    // Change user password
    $scope.resetUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/auth/reset/' + $stateParams.token, $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.passwordDetails = null;
        // Attach user profile
        Authentication.user = response;
        // And redirect to the index page
        $location.path('/password/reset/success');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
angular.module('users').controller('SettingsController', [
  '$scope',
  '$http',
  '$location',
  'Users',
  'Authentication',
  function ($scope, $http, $location, Users, Authentication) {
    $scope.user = Authentication.user;
    // If user is not signed in then redirect back home
    if (!$scope.user)
      $location.path('/');
    // Check if there are additional accounts 
    $scope.hasConnectedAdditionalSocialAccounts = function (provider) {
      for (var i in $scope.user.additionalProvidersData) {
        return true;
      }
      return false;
    };
    // Check if provider is already in use with current user
    $scope.isConnectedSocialAccount = function (provider) {
      return $scope.user.provider === provider || $scope.user.additionalProvidersData && $scope.user.additionalProvidersData[provider];
    };
    // Remove a user social account
    $scope.removeUserSocialAccount = function (provider) {
      $scope.success = $scope.error = null;
      $http.delete('/users/accounts', { params: { provider: provider } }).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.user = Authentication.user = response;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    // Update a user profile
    $scope.updateUserProfile = function (isValid) {
      if (isValid) {
        $scope.success = $scope.error = null;
        var user = new Users($scope.user);
        user.$update(function (response) {
          $scope.success = true;
          Authentication.user = response;
        }, function (response) {
          $scope.error = response.data.message;
        });
      } else {
        $scope.submitted = true;
      }
    };
    // Change user password
    $scope.changeUserPassword = function () {
      $scope.success = $scope.error = null;
      $http.post('/users/password', $scope.passwordDetails).success(function (response) {
        // If successful show success message and clear form
        $scope.success = true;
        $scope.passwordDetails = null;
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
  }
]);'use strict';
// Authentication service for user variables
angular.module('users').factory('Authentication', [function () {
    var _this = this;
    _this._data = { user: window.user };
    return _this._data;
  }]);'use strict';
// Users service used for communicating with the users REST endpoint
angular.module('users').factory('Users', [
  '$resource',
  function ($resource) {
    return $resource('users', {}, { update: { method: 'PUT' } });
  }
]);