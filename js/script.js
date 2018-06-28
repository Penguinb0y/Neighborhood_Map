//global variables
var map;
var infoWindow;
var bounds;

/*** Model ***/
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
var markerLocation = function(data) {
    var self = this;

    this.title = data.title;
    this.position = data.location;
    this.street = '',
        this.city = '',
        this.phone = '';

    this.visible = ko.observable(true);

    var clientID = 'MLLHNQX2QHJG41QTYQNFH0I1CJHWWSXYXPU4KFIWWQYNLVYF';
    var clientSecret = '1ZQJ3GQBHVOYUU24MNQJFLS0YNNIE5KKCC1ILFATGLUNYCSJ';

    // get JSON request of foursquare data
    var reqURL = 'https://api.foursquare.com/v2/venues/search?ll=' + this.position.lat + ',' + this.position.lng + '&client_id=' + clientID + '&client_secret=' + clientSecret + '&v=20160118' + '&query=' + this.title;

    $.getJSON(reqURL).done(function(data) {
        var results = data.response.venues[0];
        self.street = results.location.formattedAddress[0] ? results.location.formattedAddress[0] : 'N/A';
        self.city = results.location.formattedAddress[1] ? results.location.formattedAddress[1] : 'N/A';
        self.phone = results.contact.formattedPhone ? results.contact.formattedPhone : 'N/A';
    }).fail(function() {
        alert('Error, something went wrong with foursquare');
    });

    // Create a marker per location, and put into markers array
    this.marker = new google.maps.Marker({
        position: this.position,
        title: this.title,
        animation: google.maps.Animation.DROP,
    });

    // set marker and extend bounds
    self.filterMarkers = ko.computed(function() {
        if (self.visible() === true) {
            self.marker.setMap(map);
            bounds.extend(self.marker.position);
            map.fitBounds(bounds);
        } else {
            self.marker.setMap(null);
        }
    });

    // Click to open a infoWindow at each marker
    this.marker.addListener('click', function() {
        populateInfoWindow(this, self.street, self.city, self.phone, infoWindow);
        toggleBounce(this);
        map.panTo(this.getPosition());
    });

    // show item info when selected from list
    this.show = function(location) {
        google.maps.event.trigger(self.marker, 'click');
    };
}

var ViewModel = function() {
    var self = this;

    this.searchItem = ko.observable('');

    this.mapList = ko.observableArray([]);

    // add location markers for each location
    locations.forEach(function(location) {
        self.mapList.push(new markerLocation(location));
    });

    // locations viewed on map
    this.placesList = ko.computed(function() {
        var searchFilter = self.searchItem().toLowerCase();
        if (searchFilter) {
            return ko.utils.arrayFilter(self.mapList(), function(location) {
                var str = location.title.toLowerCase();
                var result = str.includes(searchFilter);
                location.visible(result);
                return result;
            });
        }
        self.mapList().forEach(function(location) {
            location.visible(true);
        });
        return self.mapList();
    }, self);

}

function toggleBounce(marker) {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function() {
            marker.setAnimation(null);
        }, 1400);
    }
}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.
function populateInfoWindow(marker, street, city, phone, infowindow) {
    // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;

        var windowContent = '<h4>' + marker.title + '</h4>' +
            '<p>' + street + "<br>" + city + '<br>' + phone + "</p>";

        infowindow.setContent(windowContent);
        infowindow.open(map, marker);

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick', function() {
            infowindow.setMarker = null;
        });
    }
}