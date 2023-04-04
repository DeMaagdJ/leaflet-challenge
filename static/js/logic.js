// Creating the map object
var myMap = L.map("map", {
    center: [62, -150],
    zoom: 5
  });

  // Adding the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Use this link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

d3.json(link).then(function(response) {

    console.log(response)
    

      // Create a new marker cluster group.
  var markers = L.markerClusterGroup();

  // Loop through the data.
  for (var i = 0; i < response.length; i++) {

    // Set the data location property to a variable.
    var location = response[i].feature;

console.log(location);

    // Check for the location property.
    if (location) {

      // Add a new marker to the cluster group, and bind a popup.
      markers.addLayer(L.marker([response.geometry.coordinates[1], response.geometry.coordinates[0]])
        .bindPopup(response[i].id));
    }

  }

  // Add our marker cluster layer to the map.
  myMap.addLayer(markers);

});


