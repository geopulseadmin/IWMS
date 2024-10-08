


// Now continue with your remaining JavaScript code...
// GeoServer URL
var geoserverUrl = "https://iwmsgis.pmc.gov.in/geoserver";

var workspace = "Bhavan";

// Variable to keep track of legend visibility
var legendVisible = true;
var processedLayers = [];
// Add the WMS Legend control to the map
var legendControl = L.control({ position: "topright" });

legendControl.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  // Function to fetch and populate the legend
  function updateLegend() {
    // Clear the existing legend
    div.innerHTML = '';

    // Fetch capabilities to get all layers in the 'pmc' workspace
    fetch(geoserverUrl + "/ows?service=wms&version=1.3.0&request=GetCapabilities")
      .then((response) => response.text())
      .then((data) => {
        // Parse capabilities XML response
        var parser = new DOMParser();
        var xml = parser.parseFromString(data, "text/xml");

        // Extract layer names and legend URLs for layers in the 'pmc' workspace
        var layers = xml.querySelectorAll('Layer[queryable="1"]');
        

        layers.forEach((layer) => {
          var layerName = layer.querySelector("Name").textContent;
          var layerWorkspace = layerName.split(":")[0]; // Extract workspace from layer name
          if (layerWorkspace === workspace && !processedLayers.includes(layerName)) {
            var legendUrl =
              geoserverUrl +
              "/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
              layerName;
            var layerParts = layerName.split(":"); // Split layer name by ":"
            var layerDisplayName = layerParts[layerParts.length - 1]; // Take the last part as the display name
            div.innerHTML +=
              "<p><strong>" +
              layerDisplayName + // Use layerDisplayName instead of layerName
              "</strong></p>" +
              '<img src="' +
              legendUrl +
              '" alt="' +
              layerDisplayName + // Use layerDisplayName instead of layerName
              ' legend"><br>';
            processedLayers.push(layerName); // Add processed layer to the list
          }
        });
      })
      .catch((error) => {
        console.error("Error fetching capabilities:", error);
      });
  }

  // Initially update the legend
  updateLegend();

  // Apply CSS to fit to bottom right, occupy 60% of screen height, and provide scrollbar
  div.style.position = "fixed";
  div.style.bottom = "0";
  div.style.right = "0";
  div.style.height = "40vh";
  div.style.width = "300px";
  div.style.overflowY = "auto";
  div.style.scrollbarWidth = "thin";
  div.style.backgroundColor = "white";
  div.style.border = "2px solid darkblue";
  div.style.borderRadius = "10px";
  div.style.padding = "10px";
  div.style.transition = "all 0.3s ease-in-out"; // Add transition for smooth animation

  // Toggle legend visibility function
  function toggleLegend() {
    if (legendVisible) {
      div.style.height = "0"; // Minimize the legend
      legendVisible = false;
    } else {
      div.style.height = "40vh"; // Maximize the legend
      legendVisible = true;
    }
  }

  // Add event listener to the legend control
  div.addEventListener('click', toggleLegend);

  return div;
};
// -----------------------------------------------------
// Add collapsible button
var collapseButton = L.control({ position: "topright" });

collapseButton.onAdd = function (map) {
  var button = L.DomUtil.create("button", "collapse-button");
  button.innerHTML = "<i class='fa-solid fa-list' style='color:darkblue;'></i>"; // Initial text

  // Apply styling
  button.style.backgroundColor = "white";
  button.style.border = "2px solid darkblue";
  button.style.width = "35px";
  button.style.height = "35px";
  button.style.borderRadius = "5px";
  button.style.color = "black";
  button.style.padding = "10px";
  button.style.textAlign = "center";
  button.style.textDecoration = "none";
  button.style.display = "block";
  button.style.margin = "10px";
  button.style.cursor = "pointer";
  button.style.transition = "background-color 0.3s ease-in-out"; // Add transition for smooth animation

  // Toggle legend visibility when the button is clicked
  button.onclick = function () {
    var legendDiv = document.querySelector(".info.legend");
    if (
      legendDiv.style.height === "0px" || legendDiv.style.display === "none") {


      legendDiv.style.display = "block";
      legendDiv.style.height = "40vh";
      legendDiv.style.width = "200px";
      legendDiv.style.top ="12%";
      legendDiv.style.right ="4%";
      legendDiv.style.scrollbarWidth = "thin";
      legendDiv.style.scrollbarColor =  "#163140 white";
      legendDiv.style.borderRadius= "10px";
      legendDiv.style.boxShadow = "5px 5px 5px rgba(0, 0, 0, 0.7)"; // Add shadow
      button.innerHTML = "<i class='fa-solid fa-list' style='color:darkblue;'></i>";

      button.style.backgroundColor = "white"; // Change color to indicate action
      legendVisible = true;
    } else {
      legendDiv.style.display = "none";
      button.innerHTML = "<i class='fa-solid fa-list' style='color:darkblue;'></i>";
      button.style.backgroundColor = "white"; // Change color to indicate action
      legendVisible = false;
    }
  };

  return button;
};

collapseButton.addTo(map);

// Create a legend control
var legend = L.control({ position: "bottomright" });

legend.onAdd = function (map) {
  var div = L.DomUtil.create("div", "info legend");

  // Initially hide the legend content
  div.style.display = "none";

  // Create a button to toggle the visibility of the legend content
  var toggleButton = L.DomUtil.create("button", "legend-toggle");
  toggleButton.innerHTML = "";
  toggleButton.style.backgroundColor = "transparent";

  toggleButton.onclick = function () {
    if (div.style.display === "none") {
      div.style.display = "block";
    } else {
      div.style.display = "none";
    }
  };
  div.appendChild(toggleButton);

  // Fetch capabilities to get all layers in the 'pmc' workspace
  fetch(
    "https://iwmsgis.pmc.gov.in/geoserver/ows?service=wms&version=1.3.0&request=GetCapabilities"
  )
    .then((response) => response.text())
    .then((data) => {
      // Parse capabilities XML response
      var parser = new DOMParser();
      var xml = parser.parseFromString(data, "text/xml");

      // Extract layer names and legend URLs for layers in the 'pmc' workspace
      var layers = xml.querySelectorAll('Layer[queryable="1"]');
      layers.forEach(function (layer) {
        var layerName = layer.querySelector("Name").textContent;
        if (layerName.startsWith("Bhavan:")) {
          var legendUrl =
            this.geoserverUrl +
            "/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=image/png&WIDTH=20&HEIGHT=20&LAYER=" +
            layerName;
          var layerParts = layerName.split(":"); // Split layer name by ":"
          var layerDisplayName = layerParts[layerParts.length - 1]; // Take the last part as the display name
          div.innerHTML +=
            "<p><strong>" +
            layerDisplayName +
            "</strong></p>" +
            '<img src="' +
            legendUrl +
            '" alt="' +
            layerDisplayName +
            ' legend"><br>';
        }
      });

      // Apply CSS to fit to bottom right, occupy 60% of screen height, and provide scrollbar
      div.style.position = "fixed";
      div.style.bottom = "0";
      div.style.right = "0";
      div.style.height = "60vh";
      div.style.width = "300px";
      div.style.overflowY = "auto";
      div.style.scrollbarWidth = "thin";
      div.style.backgroundColor = "white";
      div.style.border = "2px solid darkblue";
      div.style.borderRadius = "10px";
      div.style.padding = "10px";
    })
    .catch((error) => {
      console.error("Error fetching capabilities:", error);
    });

  return div;
};

legend.addTo(map);


// North Image and scale

// scale
map.options.scale = true; 

L.control.scale().addTo(map);

// Create a custom control for the north arrow
var northArrowControl = L.Control.extend({
  options: {
    position: "bottomleft",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    container.innerHTML =
      '<img  src="img/002-cardinal-point.png" class="border-0;" alt="" style="width: 25px;  height:35px; background-color: white; border:2px solid darkblue; ">';
    return container;
  },
});


map.addControl(new northArrowControl());



