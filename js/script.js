var map;

var markers = [];

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 37.573334,
            lng: -122.035542
        },
        zoom: 13
    });

    var locations = [{
        title: 'eSports Arena Oakland',
        location: {
            lat: 37.794096,
            lng: -122.272522
        }
    }, {
        title: 'Cloverleaf Family Bowl',
        location: {
            lat: 37.535377,
            lng: -121.965708
        }
    }, {
        title: 'Lake Elizabeth',
        location: {
            lat: 37.54902,
            lng: -121.962953
        }
    }, {
        title: 'De Anza College',
        location: {
            lat: 37.320196,
            lng: -122.046915
        }
    }, {
        title: 'Dave & Busters',
        location: {
            lat: 37.418428,
            lng: -121.897895
        }
    }, {
        title: 'San Francisco International Airport (SFO)',
        location: {
            lat: 37.621313,
            lng: -122.378955
        }
    }];

    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    // The following group uses the location array to create an array of markers on initialize.
    for (var i = 0; i < locations.length; i++) {
        // Get the position from the location array.
        var position = locations[i].location;
        var title = locations[i].title;
        // Create a marker per location, and put into markers array.
        var marker = new google.maps.Marker({
            map: map,
            position: position,
            title: title,
            animation: google.maps.Animation.DROP,
            id: i
        });
        // Push the marker to our array of markers.
        markers.push(marker);
        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            populateInfoWindow(this, largeInfowindow);
        });
        bounds.extend(markers[i].position);
    }
    // Extend the boundaries of the map for each marker
    map.fitBounds(bounds);
}

// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }
}