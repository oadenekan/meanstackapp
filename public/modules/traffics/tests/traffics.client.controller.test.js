'use strict';

(function() {
	// Traffics Controller Spec
	describe('Traffics Controller Tests', function() {
		// Initialize global variables
		var TrafficsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Traffics controller.
			TrafficsController = $controller('TrafficsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Traffic object fetched from XHR', inject(function(Traffics) {
			// Create sample Traffic using the Traffics service
			var sampleTraffic = new Traffics({
				name: 'New Traffic'
			});

			// Create a sample Traffics array that includes the new Traffic
			var sampleTraffics = [sampleTraffic];

			// Set GET response
			$httpBackend.expectGET('traffics').respond(sampleTraffics);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.traffics).toEqualData(sampleTraffics);
		}));

		it('$scope.findOne() should create an array with one Traffic object fetched from XHR using a trafficId URL parameter', inject(function(Traffics) {
			// Define a sample Traffic object
			var sampleTraffic = new Traffics({
				name: 'New Traffic'
			});

			// Set the URL parameter
			$stateParams.trafficId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/traffics\/([0-9a-fA-F]{24})$/).respond(sampleTraffic);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.traffic).toEqualData(sampleTraffic);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Traffics) {
			// Create a sample Traffic object
			var sampleTrafficPostData = new Traffics({
				name: 'New Traffic'
			});

			// Create a sample Traffic response
			var sampleTrafficResponse = new Traffics({
				_id: '525cf20451979dea2c000001',
				name: 'New Traffic'
			});

			// Fixture mock form input values
			scope.name = 'New Traffic';

			// Set POST response
			$httpBackend.expectPOST('traffics', sampleTrafficPostData).respond(sampleTrafficResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Traffic was created
			expect($location.path()).toBe('/traffics/' + sampleTrafficResponse._id);
		}));

		it('$scope.update() should update a valid Traffic', inject(function(Traffics) {
			// Define a sample Traffic put data
			var sampleTrafficPutData = new Traffics({
				_id: '525cf20451979dea2c000001',
				name: 'New Traffic'
			});

			// Mock Traffic in scope
			scope.traffic = sampleTrafficPutData;

			// Set PUT response
			$httpBackend.expectPUT(/traffics\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/traffics/' + sampleTrafficPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid trafficId and remove the Traffic from the scope', inject(function(Traffics) {
			// Create new Traffic object
			var sampleTraffic = new Traffics({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Traffics array and include the Traffic
			scope.traffics = [sampleTraffic];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/traffics\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTraffic);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.traffics.length).toBe(0);
		}));
	});
}());