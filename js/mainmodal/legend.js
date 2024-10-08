// Variable to keep track of legend visibility
var legendVisible = true;
var processedLayers = [];

// Department colors
var departmentColors = {
    "Road": "#FF004F",
    "Building": "#99EDC3",
    "Electric": "#fcb300",
    "Drainage": "#218be6",
    "Water Supply": "#5155d4",
    "Garden": "#7e0488",
    "Garden Horticulture": "#7e0488",
    "Slum": "#bbb",
    "City Engineer Office": "#262626",
    "Education Department": "darkblue",
    "Environment": "#000000",
    "Project Work": "#5639b3",
    "Solid waste Management": "#49a44c",
    "Market": "yellow",
    "Encroachment": "#198754",
    "Sport": "#d63384",
    // Add more departments and colors as needed
};

// Add the WMS Legend control to the map
var legendControl = L.control({ position: "topright" });

legendControl.onAdd = function (map) {
    var div = L.DomUtil.create("div", "info legend");

    // Populate the legend with manual entries based on departmentColors
    for (var department in departmentColors) {
        if (departmentColors.hasOwnProperty(department)) {
            var color = departmentColors[department];
            div.innerHTML +=
                '<div style="display: flex; align-items: center; margin-bottom: 5px;">' +
                '<div style="background:' + color + '; width: 20px; height: 20px; margin-right: 5px;"></div>' +
                '<strong>' + department + '</strong>' +
                '</div>';
        }
    }

    // Apply CSS to fit to right of collapse button
    div.style.display = "block";
    div.style.position = "fixed";
    div.style.top = "68px"; // Adjust as needed
    div.style.right = "10%"; // Position relative to the right
    div.style.height = "40vh";
    div.style.width = "170px";
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
            div.style.display = "none"; // Hide the legend
            legendVisible = false;
        } else {
            div.style.display = "block"; // Show the legend
            legendVisible = true;
        }
    }

    // Add event listener to the legend control
    div.addEventListener('click', toggleLegend);

    return div;
};

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
        if (legendDiv.style.display === "none") {
            legendDiv.style.display = "block";
            legendVisible = true;
        } else {
            legendDiv.style.display = "none";
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

    // Populate the legend with manual entries based on departmentColors
    for (var department in departmentColors) {
        if (departmentColors.hasOwnProperty(department)) {
            var color = departmentColors[department];
            div.innerHTML +=
                '<div style="display: flex; align-items: center; margin-bottom: 5px;">' +
                '<div style="background:' + color + '; width: 20px; height: 20px; margin-right: 5px;"></div>' +
                '<strong>' + department + '</strong>' +
                '</div>';
        }
    }

    // Apply CSS to fit to bottom right, occupy 60% of screen height, and provide scrollbar
    div.style.position = "fixed";
    div.style.top = "68px";
    div.style.right = "3%";
    div.style.height = "30vh";
    div.style.width = "170px";
    div.style.overflowY = "auto";
    div.style.scrollbarWidth = "thin";
    div.style.backgroundColor = "white";
    div.style.border = "2px solid darkblue";
    div.style.borderRadius = "10px";
    div.style.padding = "10px";

    return div;
};

// Add the legend to the map
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
      '<img  src="png/002-cardinal-point.png" class="border-0;" alt="" style="width: 30px;  height:50px; background-color: white; border:2px solid darkblue; ">';
    return container;
  },
});


map.addControl(new northArrowControl());




