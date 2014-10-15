'use strict';

// map controller
angular.module('map').controller('mapController', ['$scope', '$http', '$stateParams', 'Traffics', 'TrafficsComments',
    function($scope, $http, $stateParams, Traffics, TrafficsComments) {
        $scope.map = null;
        $scope.marker = null;
        $scope.currentPosition = null;
        $scope.url = 'https://api.foursquare.com/v2/venues/explore';
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
            console.log('what hapeening:' + address);
        };
        $scope.initializeSearch();

        $scope.fetchSearch = function() {
            $scope.datas = null;
            $scope.preloader = true;
            $scope.welcome = true;
            $scope.geocoder = new google.maps.Geocoder();
            $scope.address = $scope.location;
            $scope.geocoder.geocode({
                'address': $scope.address
            }, function(results) {
                // console.log(results);
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
                var url = 'https://api.foursquare.com/v2/venues/explore';
                var config = {
                    params: {
                        client_secret: 'QWVA0TKCGU404SQEZGSUMBYWC5FB523KQPRTQWG2K3AXF00H',
                        client_id: 'CTQUBJ0VCHZS5O405Z0G5SCRCWVECGGJ3QKLTRVSRUG2RI0E',
                        ll: '',
                        radius: '50000',
                        v: '20140707',
                        query: '',
                        callback: 'JSON_CALLBACK'
                    }
                };
                config.params.ll = latlng;
                config.params.query = $scope.searchfor;
                $http.jsonp($scope.url, config).success(function(reply) {
                    $scope.preloader = false;
                    $scope.datas = reply.response.groups[0].items;
                });
                // console.log("what's hapeening: " + $scope.fetchSearch());
            });
            $scope.checkLocation($scope.address);
        };

        // $scope.checkLocation = function(locale) {
        //     $scope.commentsArray = [];
        //     console.log('check location is running');
        //     $scope.place = Traffics.query().$promise.then(function(response) {
        //         $scope.storedLocations = response;
        //         console.log("storedLocations");
        //         console.log($scope.storedLocations);
        //         angular.forEach($scope.storedLocations, function(value, key) {
        //             console.log("locale");
        //             console.log(locale);
        //             console.log("value location");
        //             console.log(value.location);
        //             if (locale === value.location) {
        //                 console.log(value.location);
        //                 $scope.getComments();
        //             } else {
        //                 $scope.createLocation(locale);
        //             }
        //         });
        //     });

        // };
        $scope.checkLocation = function(locale) {
            $scope.storedLocation = [];
            console.log('check location is running');
            $scope.bool = true;
            $scope.place = Traffics.query({
                'location': locale
            }).$promise.then(function(response) {
                $scope.locationArray = response;
                console.log('check location array');
                console.log(response);
                console.log('check location array done');
                angular.forEach($scope.locationArray, function(value, key) {
                    $scope.storedLocation[key] = value;
                    console.log('location check');
                    console.log($scope.storedLocation);
                    console.log('location check done');
                    if ($scope.storedLocation.location === locale) {
                        $scope.getComments();
                        $scope.bool = false;
                    }
                    // console.log(value);
                    // console.log("storedLocations");
                    // console.log($scope.storedLocation.location);
                    // console.log('length');
                    // console.log($scope.locationArray);
                    // for (var i = 0; i <= $scope.storedLocation.length; i++) {
                    //     if ($scope.storedLocation[i].location === locale) {
                    //         $scope.getComments();
                    //         $scope.bool = false;
                    //     }
                    // }
                });
                // if ($scope.bool) {
                //     $scope.createLocation(locale);
                // }

            });

        };

        // $scope.getComments = function() {
        //     console.log('get comments is working');
        //     $scope.allComments = TrafficsComments.query({
        //         trafficId: $stateParams.trafficId
        //     }).$promise.then(function(response) {
        //         $scope.trafficIdComments = response;
        //         console.log('Traffic Id');
        //         console.log($scope.trafficIdComments);
        //     });

        // };

        // $scope.createLocation = function(newLocation) {
        //     console.log('createlocation is running');
        //     var location = new Traffics({
        //         location: newLocation
        //     });
        //     location.$save(function(response) {
        //             $scope.location = response;
        //             $scope.commentInput = '';
        //         },
        //         function(errorResponse) {
        //             $scope.error = errorResponse.data.message;
        //         });
        // };

        $scope.createComment = function() {
                var traffic = new Traffics({
                    location: $scope.address
                });

                traffic.$save(function(res) {
                    console.log("sucsful save traffic");

                    var comment = new TrafficsComments({
                        body: $scope.comment,
                        trafficId: res._id
                    });

                    comment.$save(function(response) {
                            // var trafficId = $stateParams.trafficId;
                            // $scope.comments = '';

                            console.log('Suceess comment', response.body);
                        },
                        function(errorResponse) {
                            $scope.error = errorResponse.data.message;
                            console.log('Error message');
                        });
                });
            }
            // console.log(comment);


        // });




        // console.log(commentInput);



        // };

        $scope.findComments = function() {
            $scope.comment = TrafficsComments.query({
                trafficId: $stateParams.trafficId
            });
        };


        // $scope.find = function() {
        //     $scope.comments = Comments.query();
        //     console.log($scope.comments);
        // }

        // $scope.findOne = function() {
        //     $scope.comment = Comments.get({
        //         commentId: $stateParams.commentId
        //     })
        // }

        // article.$update(function() {
        //     $location.path('articles/' + article._id);
        // }, function(errorResponse) {
        //     $scope.error = errorResponse.data.message;
        // });

    }
]);
