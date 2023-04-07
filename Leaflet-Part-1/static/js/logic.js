 // Use this link to get the GeoJSON data.
var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Perform a GET request to the query URL/
d3.json(link).then(function (data) {
  console.log(data)

    createFeatures(data.features);
  });

  function createFeatures(earthquakeData){

    function onEachFeature(feature, layer){layer.bindPopup(`<h3>Location: ${feature.properties.place}</h3><hr><p> 
        Magnitude: ${feature.properties.mag}</p><hr><p>Depth: ${feature.geometry.coordinates[2]}`)}

  // Create a GeoJSON layer containing the features array on the earthquakeData object
  function createCircleMarker(feature, latlng){
    var options = {
     radius:feature.properties.mag*5,
     fillColor: chooseColor(feature.properties.mag),
     color: chooseColor(feature.properties.mag),
     weight: 3,
     opacity: 0.6,
     fillOpacity: 0.65
    } 
    return L.circleMarker(latlng,options);
  }

   // Create a GeoJSON layer that contains the features array on the earthquakeData object.
  // Run the onEachFeature function once for each piece of data in the array.
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: createCircleMarker
  });

  // Send our earthquakes layer to the createMap function/
  createMap(earthquakes);
  }

  // Circles color palette based on mag (feature) data marker: data markers should reflect the magnitude of the earthquake by their size and the depth of the earthquake by color. Earthquakes with higher magnitudes should appear larger, and earthquakes with greater depth should appear darker in color.
function chooseColor(mag) {
  switch (true) {
    case (1.0 <= mag && mag <= 2.0):
      return "#ffff66"; // Yellow 70% light
    case (2.0 <= mag && mag <= 3.0):
      return "#e6e600"; // Yellow 45% light
    case (3.0 <= mag && mag <= 4.0):
      return "#b3ffcc"; // Green 85% light
    case (4.0 <= mag && mag <= 5.0):
      return "#00ff55"; // Green 50% light
    case (5.0 <= mag && mag <= 20.0):
      return "#00802b"; // Green 25% light
    default:
      return "#E2FFAE"; // Green 84% light
  };
}

// Create map legend to provide context for map data
let legend = L.control({position: 'bottomright'});

legend.onAdd = function() {
    var div = L.DomUtil.create('div', 'info legend');
    var grades = [1.0, 2.5, 4.0, 5.5, 8.0];
    var labels = [];
    var legendInfo = "<h4>Magnitude</h4>";

    div.innerHTML = legendInfo

    // go through each magnitude item to label and color the legend
    // push to labels array as list item
    for (var i = 0; i < grades.length; i++) {
          labels.push('<ul style="background-color:' + chooseColor(grades[i] + 1) + '"> <span>' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '' : '+') + '</span></ul>');
        }

      // add each label list item to the div under the <ul> tag
      div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    
    return div;
  };

// Create map
function createMap(earthquakes) {
  // Define outdoors and graymap layers
  let streetstylemap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "outdoors-v11",
    accessToken: "pk.eyJ1IjoiZGVtbWFnZGoiLCJhIjoiY2xnM2JweGdrMDdncDNscGVnNGtkOW8wOSJ9.cxqqJSL-Fx2Zefp-RUJRtA"
  })

  let graymap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 20,
    id: "light-v10",
    accessToken: "pk.eyJ1IjoiZGVtbWFnZGoiLCJhIjoiY2xnM2JweGdrMDdncDNscGVnNGtkOW8wOSJ9.cxqqJSL-Fx2Zefp-RUJRtA"
  });

  // Define a baseMaps object to hold our base layers
  let baseMaps = {
    "Outdoors": streetstylemap,
    "Grayscale": graymap
  };

  // Create overlay object to hold our overlay layer
  let overlayMaps = {
    Earthquakes: earthquakes
  };

  // Create our map, giving it the streetmap and earthquakes layers to display on load
  let myMap = L.map("map", {
    center: [
      39.8282, -98.5795
    ],
    zoom: 4,
    layers: [streetstylemap, earthquakes]
  });
  // Add the layer control to the map
  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);
  legend.addTo(myMap);
}
