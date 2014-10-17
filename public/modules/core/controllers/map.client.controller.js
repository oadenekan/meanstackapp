'use strict';

// map controller
angular.module('map').controller('mapController', ['$scope', '$http', '$stateParams', 'Traffics', 'TrafficsComments',
    function($scope, $http, $stateParams, Traffics, TrafficsComments) {
        $scope.map = null;
        $scope.marker = null;
        $scope.currentPosition = null;
        $scope.geocoder = null;

        $scope.getLocation = function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    $scope.showPosition(position);
                });
            } else {
                alert('Geolocation is not supported by this browser.');
            }
        };
        $scope.showPosition = function(position) {
            $scope.loadMap(position.coords);
            $scope.currentPosition = position.coords;
        };
        $scope.loadMap = function(coordinates) {
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
                rotateControl: true,
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
            google.maps.event.addListener($scope.marker, 'click', function() {
                $scope.map.setZoom(15);
                $scope.map.setCenter($scope.marker.getPosition());
            });
            google.maps.event.addListener($scope.map, 'center_changed', function() {
                window.setTimeout(function() {
                    $scope.map.panTo($scope.marker.getPosition());
                }, 40000);
            });
        };

        $scope.initializeSearch = function() {
            var address = (document.getElementById('searchBox'));
            var autocomplete = new google.maps.places.Autocomplete(address);
            autocomplete.setTypes(['address']);
            google.maps.event.addListener(autocomplete, 'place_changed', function() {
                var place = autocomplete.getPlace();
                if (!place.geometry) {
                    return;
                }
                $scope.location = place.formatted_address;
                var address = '';
                if (place.address_components) {
                    address = [
                        (place.address_components[0] && place.address_components[0].short_name || ''), (place.address_components[1] && place.address_components[1].short_name || ''), (place.address_components[2] && place.address_components[2].short_name || '')
                    ].join(' ');
                }
            });
        };
        $scope.initializeSearch();

        $scope.fetchSearch = function() {
            $scope.geocoder = new google.maps.Geocoder();
            $scope.address = $scope.location;
            $scope.geocoder.geocode({
                'address': $scope.address
            }, function(results) {
                var newLat = results[0].geometry.location.lat();
                var newLng = results[0].geometry.location.lng();
                var mapOptions = {
                    zoom: 5,
                    center: new google.maps.LatLng(newLat, newLng),
                };
                $scope.marker = new google.maps.Marker({
                    position: mapOptions.center,
                    animation: google.maps.Animation.BOUNCE
                });
                $scope.marker.setMap($scope.map);
                $scope.map.setCenter($scope.marker.getPosition());
                var lat = (results[0].geometry.location.lat());
                var lng = (results[0].geometry.location.lng());
                var latlng = (lat + ', ' + lng);
            });
            $scope.checkLocation($scope.address);
        };


        // This function checks the database to see if this location exists
        $scope.checkLocation = function(locale) {
            $scope.place = Traffics.query({
                location: locale
            });
            
            if($scope.place.$resolved && !$scope.place.length){
                $scope.traffic = $scope.place[0];

                $scope.findComments();

            } else {
                var traffics = new Traffics({
                    location: locale
                });

                traffics.$save(function(res) {
                    $scope.traffic = res;
                    $scope.findComments();
                });
            }

        }


        $scope.createComment = function() {

            var comment = new TrafficsComments({
                body: $scope.comment
            });

            comment.$save({trafficId: $scope.traffic._id}, function(response) {
                $scope.comments = response.comments;
            }, function(errorResponse) {
                $scope.error = errorResponse.data.message;
            });

        };

        $scope.findComments = function() {
            $scope.comments = TrafficsComments.query({
                trafficId: $scope.traffic._id
            });
        };

    }
]);
