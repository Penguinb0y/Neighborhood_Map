//global variables
var map;
var infoWindow;
var bounds;

// init google maps
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 37.573334,
            lng: -122.035542
        },
        zoom: 13,
        mapTypeControl: false
    });

    infoWindow = new google.maps.InfoWindow();
    bounds = new google.maps.LatLngBounds();

    ko.applyBindings(new ViewModel());
}

// handle map error
function googleMapsError() {
    alert('An error occurred with Google Maps!');
}

/*** Marker Model ***/
var markerLocation = function (data) {
    var self = this;

    this.title = data.title;
    this.position = data.location;
    this.visible = ko.observable(true);

    // Create a marker per location, and put into markers array
    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP
    });

    // set marker and extend bounds (showListings)
    this.marker.setMap(map);
    bounds.extend(this.marker.position);
    map.fitBounds(bounds);

    // Click to open a infoWindow at each marker
    this.marker.addListener('click', function () {
        populateInfoWindow(self, infoWindow);
    });

    // creates bounce effect when item selected
    this.bounce = function (place) {
        google.maps.event.trigger(self.marker, 'click');
    };

}

function ViewModel() {
    var self = this;

    this.mapList = ko.observableArray([]);

    locations.forEach(function (location) {
        self.mapList.push(new markerLocation(location));
    });

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
        infowindow.addListener('closeclick', function () {
            infowindow.setMarker = null;
        });
    }
}