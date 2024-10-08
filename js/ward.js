var map, geojson;

//Add Basemap
var map = L.map("map", {
  center: [18.52, 73.89],
  zoom: 11,
  minZoom: 10,
  maxZoom: 19,
  zoomSnap: 0.5,
  zoomDelta: 0.5,
});

var googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 21,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);


var baseURL = "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms";
// var demoURL ="https://iwmsgis.pmc.gov.in/geoserver/demo/wms";

function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

const lenght =
  getQueryParam("length") !== undefined
    ? parseInt(getQueryParam("length"), 10)
    : 40;
const width =
  getQueryParam("width") !== undefined
    ? parseInt(getQueryParam("width"), 10)
    : 10;
const lastInsertedId = getQueryParam("lastInsertedId");
const wardname = getQueryParam("wardName");
const department = getQueryParam("department");
const workType = getQueryParam("workType");
const struct_no = getQueryParam("struct_no");
const user_id = getQueryParam("user_id");
const worksAaApprovalId = getQueryParam("proj_id");
let ward_id =  getQueryParam('ward_id') ;
let zone_id =  getQueryParam('zone_id') ;
let prabhag_id =  getQueryParam('prabhag_id') ;
let editMode =  getQueryParam('edit') ;
let editId =  getQueryParam('editId') ;




var wardBoundary = null;
console.log(workType);

var lastDrawnPolylineIdSave = null;

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
}).addTo(map);

var wms_layer1 = L.tileLayer.wms(
  baseURL,
  {
    layers: "Roads",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
);

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom: 19.9,
  }
);
var baseLayers = {};

var wms_layer12 = L.tileLayer
  .wms(baseURL, {
    layers: "PMC_Boundary",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }).addTo(map);

var wms_layer14 = L.tileLayer.wms(
  baseURL,
  {
    layers: "Data",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
);

var wms_layer15 = L.tileLayer.wms(
  baseURL,
  {
    layers: "Revenue",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
);

var wms_layer17 = L.tileLayer.wms(
  baseURL,
  {
    layers: "Village_Boundary",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  }
);
var wms_layer3 = L.tileLayer.wms(
  baseURL,
  {
    layers: "PMC_Layers",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
);

var IWMS_point = L.tileLayer.wms(
  baseURL,
  {
    layers: "IWMS_point",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  }
);

var IWMS_line = L.tileLayer.wms(
  baseURL,
  {
    layers: "IWMS_line",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
);

var wms_layer16 = L.tileLayer.wms(
  baseURL,
  {
    layers: "OSM_Road",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
);

var Zone_layer = L.tileLayer.wms(
  baseURL,
  {
    layers: "Zone_layer",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  }
);

var ward_admin_boundary = L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in//geoserver/pmc/wms",
  {
    layers: "PMC_wards_admin_boundary",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  }
).addTo(map);


var ward_boundary = L.tileLayer
  .wms(baseURL, {
    layers: "ward_boundary1",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  })
  .addTo(map);


// //////////////////////////added 11-03-2023/////////////////////////////////////////

var WMSlayers = {
  OSM: osm,
  Esri: Esri_WorldImagery,
  Satellite: googleSat,
  Roads: wms_layer1,
  Boundary: wms_layer12,
  // Amenity: wms_layer11,
  // Drainage: wms_layer13,
  Data: wms_layer14,
  Revenue: wms_layer15,
  Village: wms_layer17,
  PMC: wms_layer3,
  ward_boundary: ward_boundary,
  // geodata: wms_layer4,
  OSMRoad: wms_layer16,
};

// refreshWMSLayer();
var control = new L.control.layers(baseLayers, WMSlayers).addTo(map);
control.setPosition("topright");

// FeatureGroup to store drawn items
var drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

function fitbou(filter) {
  var layer = prabhag_ids.length > 0 ? "PMC_wards_admin_boundary" : "ward_boundary1";
  var urlm =
    "https://iwmsgis.pmc.gov.in/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
    layer +
    "&CQL_FILTER=" +
    filter +
    "&outputFormat=application/json";
  console.log(urlm);
  $.getJSON(urlm, function (data) {
    geojson = L.geoJson(data, {});
    wardBoundary = data;
    map.fitBounds(geojson.getBounds());
  });
}

if (editMode) {
  // edit id is coming as IWMS_line.11338
  // split the string and get the id
 let editIdTemp = editId.split(".")[1];
 let geometryTypeTemp = editId.split(".")[0];
  $.ajax({
      url: 'APIS/get_geometry_page_edit_layer.php', // Path to the PHP script
      type: 'GET',
      data: { id: editIdTemp, geometryType: geometryTypeTemp == 'IWMS_line' ? 'LineString' : geometryTypeTemp == 'IWMS_point' ? 'Point' : 'Polygon' },
      dataType: 'json',
      success: function (response) {
          const geometry = response.data;

          let coordinatesData = [];
          if (geometry.type == 'Polygon') {
              // Handle single Polygon
              coordinatesData.push(
                  L.polygon(geometry.coordinates[0].map((coord) => [coord[1], coord[0]]))
              );
          } else if (geometry.type === 'MultiPolygon') {
              // Handle MultiPolygon
              geometry.coordinates.forEach((polygonCoords) => {
                  coordinatesData.push(L.polygon(polygonCoords[0].map((coord) => [coord[1], coord[0]])));
              });
          } else if (geometry.type === 'LineString') {
              // Handle single LineString
              let coordinates = geometry.coordinates.map((coord) => [coord[1], coord[0]]);
              coordinatesData.push(L.polyline(coordinates, { color: 'red' }));
          } else if (geometry.type === 'MultiLineString') {
              // Handle MultiLineString
              geometry.coordinates.forEach((lineCoords) => {
                  let coordinates = lineCoords.map((coord) => [coord[1], coord[0]]);
                  coordinatesData.push(L.polyline(coordinates, { color: 'red' }));
              });
          }

          // Add polygons to the map and make them editable
          coordinatesData.forEach((layer) => {
            editableLayers.addLayer(layer); // Add to editable layers
         
            layer.on('click', function () {
                if (layer.editing) {
                    layer.editing.enable();
                    updatePopupEdit(layer);
                    layer.on('edit', function () {
                      updatePopupEdit(layer);
                    });
                }
            });
        });

          // Fit the map view to the bounds of the polygons
          if (coordinatesData.length > 0) {
              let bounds = coordinatesData.reduce((bounds, polygon) => {
                  return bounds.extend(polygon.getBounds());
              }, L.latLngBounds());
              map.fitBounds(bounds);
          }
      },
      error: function (error) {
          console.error('AJAX request failed:', error);
      },
  });
}

// Add edit event handler to save changes
map.on(L.Draw.Event.EDITED, function (event) {
  const layers = event.layers;
  layers.eachLayer(function (layer) {
      // Here you can save the updated geometry back to your server
      const updatedGeoJSON = layer.toGeoJSON();
      console.log('Updated geometry:', updatedGeoJSON);
      // Perform your AJAX call to save the updated geometry
  });
});



console.log(ward_id, zone_id, prabhag_id);

let ward_ids = ward_id ? ward_id.split(',').filter(id => id && id !== 'null') : [];
let zone_ids = zone_id ? zone_id.split(',').filter(id => id && id !== 'null') : [];
let prabhag_ids = prabhag_id ? prabhag_id.split(',').filter(id => id && id !== 'null') : [];

let cql_filterm = '';





if (zone_ids.length > 0) {
  cql_filterm = `zone_id IN(${zone_ids.map(id => `'${id}'`).join(",")})`;
} else {
  console.log('No valid zone_id provided.');
}

// Add ward_id to the filter
if (ward_ids.length > 0) {
  cql_filterm += ` AND ward_id IN(${ward_ids.map(id => `'${id}'`).join(",")})`;
} else {
  console.log('No valid ward_id provided.');
}

// Add prabhag_id to the filter if any
if (prabhag_ids.length > 0) {
  cql_filterm += ` AND prabhag_id IN(${prabhag_ids.map(id => `'${id}'`).join(",")})`;
}


function applyFilter() {
  if (prabhag_ids.length > 0) {
    ward_admin_boundary.setParams({
       cql_filter: cql_filterm,
      styles: "highlight"
    });
    ward_admin_boundary.addTo(map).bringToFront();
  } else {
    ward_boundary.setParams({
      //  cql_filter: 'ward_id IN('1')',
      cql_filter: `ward_id IN(${ward_ids.map(id => `'${id}'`).join(",")})`,
      styles: "highlight"
    });
    ward_boundary.addTo(map).bringToFront();
  }

  cql_filterm = prabhag_ids.length > 0 ? cql_filterm : `ward_id IN(${ward_ids.map(id => `'${id}'`).join(",")})`;

  fitbou(cql_filterm);
}

// Call the function to apply the filter
applyFilter();





// Add a search bar
var searchControl = new L.esri.Controls.Geosearch().addTo(map);
var results = new L.LayerGroup().addTo(map);

// Handle search results
searchControl.on("results", function (data) {
  results.clearLayers();
  for (var i = data.results.length - 1; i >= 0; i--) {
    results.addLayer(L.marker(data.results[i].latlng));
  }
});

//******** draw controls */

var customSaveButton = L.control({ position: "topleft" });

customSaveButton.onAdd = function (map) {
  var div = L.DomUtil.create("div", "save-button");
  div.innerHTML =
    '<button id="save-button" type="button"  title="Save Feature"> <i class="fa-regular fa-floppy-disk"></i> </button>';
  customDrawControlsContainer = div;
  return div;
};

customSaveButton.addTo(map);


var customSaveEditButton = L.control({ position: "topleft" });
customSaveEditButton.onAdd = function (map) {
  var div = L.DomUtil.create("div", "saveDataButton");
  div.innerHTML =
    '<button id="saveDataButton" type="button"  title="Save Feature"> <i class="fa-regular fa-floppy-disk"></i></button>';
  customDrawControlsContainer = div;
  return div;
};

customSaveEditButton.addTo(map);

// save data button

if(editMode){





var saveEditGeomButton = L.control({ position: 'topleft' });
saveEditGeomButton.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'saveEditGeomButton');
  div.innerHTML = '<button id="saveEditGeomButton" type="button"  title="Save Feature"> <i class="fa-regular fa-floppy-disk"></i></button>';
  customDrawControlsContainer = div;
  return div;
};


saveEditGeomButton.addTo(map);


document.getElementById('saveEditGeomButton').addEventListener('click', function () {
  let geojson = [];
  editableLayers.eachLayer(function (layer) {
      geojson.push(layer.toGeoJSON());
  });

  let editIdTemp = editId.split(".")[1];
  let geometryTypeTemp = editId.split(".")[0];

  $.ajax({
      url: 'APIS/Update_Geometry.php', // Path to your PHP save script
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ selectCoordinatesData: geojson,
        fid:editIdTemp,
        geometryType:
        geojson[0].geometry.type,
       }),
      success: function (response) {
        window.reload();
          alert('Data saved successfully!');
      },
      error: function (error) {
          console.error('Save request failed:', error);
      }
  });


  let area = turf.area(geojson[0].geometry);
  let centroid = turf.centroid(geojson[0].geometry);
  let polygon_centroid = centroid?.geometry?.coordinates;
  var formData = new FormData();
  formData.append('proj_id', worksAaApprovalId);
  formData.append('latitude',  geojson[0].geometry.coordinates[0][1]);
  formData.append('longitude',  geojson[0].geometry.coordinates[0][0]);
  formData.append('polygon_area', area);
  formData.append('polygon_centroid', JSON.stringify(polygon_centroid));
  formData.append('geometry', JSON.stringify(geojson[0].geometry.coordinates?.map(coordinates => coordinates.slice().reverse())));
  formData.append('road_no', struct_no);
  formData.append('user_id', user_id);







  $.ajax({
          type: "POST",
          url: "https://iwms.punecorporation.org/api/gis-data",
          data: formData,
          processData: false,
          contentType: false,
          success: function (response) {
         
            window.location.href = response.data.redirect_Url;
          },
          error: function (xhr, status, error) {
            console.error("Save failed:", error);
          },
        });


        });

     

//deleteEditGeomButton



var deleteEditGeomButton = L.control({ position: 'topleft' });
deleteEditGeomButton.onAdd = function (map) {
  var div = L.DomUtil.create('div', 'deleteEditGeomButton');
  div.innerHTML = '<button id="deleteEditGeomButton" type="button"  title="Save Feature"> <i class="fa-regular fa-trash-alt"></i></button>';
  customDrawControlsContainer = div;
  return div;
};


deleteEditGeomButton.addTo(map);



document.getElementById('deleteEditGeomButton').addEventListener('click', function () {

  let editIdTemp = editId.split(".")[1];
  let geometryTypeTemp = editId.split(".")[0];

  $.ajax({
      url: 'APIS/Delete_Geometry.php', // Path to your PHP save script
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        fid:editIdTemp,
        geometryType: geometryTypeTemp == 'IWMS_line' ? 'LineString' : geometryTypeTemp == 'IWMS_point' ? 'Point' : 'Polygon',
       }),
      success: function (response) {
          alert('Data Deleted successfully!');
          window.location.reload();
      },
      error: function (error) {
          console.error('Save request failed:', error);
      }
  });
});
}


var customEditLayerButton = L.control({ position: "topleft" });

customEditLayerButton.onAdd = function (map) {
  var div = L.DomUtil.create("div", "editFeatureButton");
  div.innerHTML =
    '<img id="editFeatureButton"  title=" Edit Feature" src="png/editTool.png" style="width: 24px; height: 24px;">';
  customDrawControlsContainer = div;
  return div;
};

customEditLayerButton.addTo(map);

var customDeleteLayerButton = L.control({ position: "topleft" });

customDeleteLayerButton.onAdd = function (map) {
  var div = L.DomUtil.create("div", "deleteFeatureButton");
  div.innerHTML =
    '<button id="deleteFeatureButton"  title="Delete Feature"> <i class="fa-solid fa-trash-can"></i></button>';
  customDrawControlsContainer = div;
  return div;
};

customDeleteLayerButton.addTo(map);

function enableEditing(layer) {
 
  drawnItems.eachLayer(function (otherLayer) {
    if (
      otherLayer !== layer &&
      otherLayer.editing &&
      otherLayer.editing.enabled()
    ) {
      otherLayer.editing.disable();
    }
  });
  var edit = new L.EditToolbar.Edit(map, {
    featureGroup: L.featureGroup([layer]), // Create a new feature group containing only the selected layer
    remove: true,
  });
  edit.enable();
}

if (workType == "New") {
  // Currently selected layer for editing
  // Custom button for toggling edit mode
  var editControl = L.control({ position: "topleft" });
  editControl.onAdd = function (map) {
    var controlDiv = L.DomUtil.create(
      "div",
      "leaflet-control-edit leaflet-bar leaflet-control"
    );

    var controlUI = L.DomUtil.create(
      "a",
      "leaflet-control-edit-interior",
      controlDiv
    );
    controlUI.title = "Edit features";
    controlUI.href = "#";
    controlUI.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
    // controlUI.style.fontSize='18px';
    // controlUI.style.position='absolute';
    // controlUI.style.top='60px';
    // controlUI.style.border='2px solid darkblue';
    // controlUI.style.borderRadius='5px'
    controlUI.style.display = "none";

    L.DomEvent.addListener(controlUI, "click", function (e) {
      L.DomEvent.preventDefault(e);

      // Disable all layers' editing mode first
      drawnItems.eachLayer(function (layer) {
        if (layer.editing && layer.editing.enabled()) {
          layer.editing.disable();
        }
      });

      // Enable editing mode on click if not enabled
      if (!map.editEnabled) {
        alert("Please select a feature to edit.");
        map.editEnabled = true;
        controlUI.innerHTML = '<i class="fa-regular fa-floppy-disk"></i>';
        // Allow user to click on a feature to select and edit
        drawnItems.eachLayer(function (layer) {
          layer.on("click", function () {
            layer.setStyle({ color: "green", weight: 7 });

            enableEditing(layer); // Enable editing on the clicked layer
          });
        });
      } else {
        map.editEnabled = false;
        controlUI.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
        // Remove click handlers to disable selection
        drawnItems.eachLayer(function (layer) {
          layer.setStyle({ color: "red", weight: 7 });
          layer.off("click");
        });
      }
    });

    return controlDiv;
  };

  editControl.addTo(map);

  var selectedPolylineId = null;

  var deleteControl = L.control({ position: "topleft" });

  deleteControl.onAdd = function (map) {
    var container = L.DomUtil.create("div", "leaflet-bar");
    var button = L.DomUtil.create("button", "delete-button", container);
    button.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    button.title = "Delete Selected Feature";

    button.onclick = function () {
      if (selectedPolylineId) {
        handleDeletePolyline(selectedPolylineId._leaflet_id);
        selectedPolylineId = null; // Reset selected polyline ID after deletion
        button.style.backgroundColor = "white";
      } else {
        alert("Please select a feature to delete.");
        button.style.backgroundColor = "red";
        drawnItems.eachLayer(function (layer) {
          layer.on("click", function () {
        ;
            selectedPolylineId = layer;
            layer.setStyle({ color: "green", weight: 7 });
          });
        });
      }
    };

    return container;
  };

  deleteControl.addTo(map);
}

function handleDeletePolyline(polylineId) {
 
  removeAssociatedLayers(polylineId);
}

function toggleEditDeleteButton(show) {
  var saveBtns = document.getElementsByClassName("delete-button");
  var editBtn = document.getElementsByClassName(
    "leaflet-control-edit-interior"
  );
  for (let i = 0; i < saveBtns.length; i++) {
    saveBtns[i].style.display = show ? "block" : "none";
    editBtn[i].style.display = show ? "block" : "none";
  }
}

function toggleSaveButton(show) {
  var saveBtn = document.getElementById("save-button");
  if (saveBtn) {
    saveBtn.style.display = show ? "block" : "none";
  }
}

// Button Click Event to Show SweetAlert Success Popup
document.getElementById("save-button").addEventListener("click", function () {
  Swal.fire({
    icon: "success",
    title: "Success",
    text: "Your feature has been saved successfully!",
    customClass: {
      popup: "my-custom-popup", // Custom class for the popup
      title: "my-custom-title", // Custom class for the title
      content: "my-custom-text", // Custom class for the text
    },
  });
});

var isDrawControlAdded = false;

document
  .querySelector("#save-button")
  .addEventListener("click", function (event) {
    Savedata(lastDrawnPolylineIdSave);
  });

function checkIfInsideWard(latlng) {
  var point = turf.point([latlng.lng, latlng.lat]);
  var isInside = false;

  wardBoundary.features.forEach(function (feature) {
    if (turf.booleanPointInPolygon(point, feature)) {
      isInside = true;
    }
  });

  return isInside;
}

map.on("draw:deleted", function (e) {
  e.layers.eachLayer(function (layer) {
    removeAssociatedLayers(layer._leaflet_id);
  });

  traceLayer.clearLayers();

  // Reset the currentPolyline variable to null to ensure it doesn't retain any old reference
  if (currentPolyline) {
    currentPolyline.remove(); // Removes the polyline from the map
    currentPolyline = null; // Dereferences the polyline object
  }
});

//  Bottom Data table
$(document).ready(function () {
  var dataTable = null;
  var tableContainer = $("#table-container");

  $("#showTableBtn").click(function () {
    // If DataTable is already initialized, just show the table container
    if (dataTable) {
      tableContainer.slideDown();
      return;
    }

    $("#workTable tfoot th").each(function () {
      var title = $("#workTable thead th").eq($(this).index()).text();
      $(this).html(
        '<input type="text" class="form-control" placeholder="Search ' +
          title +
          '" />'
      );
    });

    $.ajax({
      url: "API-Responses/all-project-data.json",
      method: "GET",
      success: function (response) {
        var data = response.data.projectData;

        // Initialize DataTable if not already initialized
        dataTable = $("#workTable").DataTable({
          data: data.map(function (project) {
            return [
              project.project.name_of_work,
              project.project.work_type,
              project.project.created_date,
              getZoneNameById(
                project.project.constituency_zone_id,
                response.data.zoneData
              ),
              getWardNameById(
                project.project.constituency_ward_id,
                response.data.wardData
              ),
              "", // Assuming this is for Prabhag data
            ];
          }),
          columns: [
            { title: "Name of Work" },
            { title: "Work Type" },
            { title: "Work Completion Date" },
            { title: "Zone" },
            { title: "Ward" },
            { title: "Prabhag" },
          ],
        });

        // Filter event for each column
        dataTable
          .columns()
          .eq(0)
          .each(function (colIdx) {
            $("input", dataTable.column(colIdx).footer()).on(
              "keyup change",
              function () {
                dataTable.column(colIdx).search(this.value).draw();
              }
            );
          });

        // Show the table container
        tableContainer.slideDown();
      },
      error: function (xhr, status, error) {
        console.error("Error fetching data:", error);
      },
    });
  });

  // Add event listener to DataTable rows
  $("#workTable tbody").on("click", "tr", function () {
    var data = dataTable.row(this).data();
    var nameOfWork = data[0]; // Assuming the first column contains the name of the work

    // Your logic to determine the coordinates of the highlighted area based on the clicked data
    var highlightedAreaCoordinates = [
      [18.532343, 73.917303],
      [18.526969, 73.926744],
      [18.533809, 73.928547],
      [18.532343, 73.917303], // Example coordinates, replace with your actual coordinates
    ];

    // Create a polygon layer representing the highlighted area and add it to the map
    var highlightedAreaLayer = L.polygon(highlightedAreaCoordinates, {
      color: "red",
      fillColor: "red",
      fillOpacity: 0.5,
    }).addTo(map);

    // Fit the map view to the bounds of the highlighted area
    map.fitBounds(highlightedAreaLayer.getBounds());
  });

  // Hide table on close button click
  $("#closeTableBtn").click(function () {
    tableContainer.slideUp();
  });
});

$(document).ready(function () {
  let allProjectData;

  $.ajax({
    url: "API-Responses/all-project-data.json",
    method: "GET",
    success: function (data) {
      allProjectData = data.data.projectData;
    },
    error: function (xhr, status, error) {
      console.error("Error fetching all project data:", error);
    },
  });

  $("#searchInput").autocomplete({
    minLength: 3,
    source: function (request, response) {
      let searchTerm = request.term;
      if (searchTerm.length >= 3) {
        let filteredData = allProjectData.filter(function (item) {
          let nameOfWorkMatch =
            item.project.name_of_work
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1;
          let jeNameMatch =
            item.project.je_name
              .toLowerCase()
              .indexOf(searchTerm.toLowerCase()) !== -1;
          return nameOfWorkMatch || jeNameMatch;
        });
        let suggestions = filteredData.map((item) => item.project.name_of_work);
        suggestions = suggestions.slice(0, 10);
        response(suggestions);
      } else {
        response([]);
      }
    },
    select: function (event, ui) {
      $("#searchInput").val(ui.item.label);
      drawHighlightedArea(ui.item.label);
      return false;
    },
  });

  function drawHighlightedArea(nameOfWork) {
    let project = allProjectData.find(
      (item) => item.project.name_of_work === nameOfWork
    );

    if (project) {
      let allCoordinates = [];

      if (project.gis && Array.isArray(project.gis)) {
        project.gis.forEach((gisObject) => {
          if (gisObject.geometry) {
            let geometryCoordinates = JSON.parse(gisObject.geometry);
            allCoordinates = allCoordinates.concat(geometryCoordinates);
          }
        });
      }

      if (allCoordinates.length > 0) {
        let highlightedAreaCoordinates = allCoordinates;

        let highlightedAreaLayer = L.polygon(highlightedAreaCoordinates, {
          color: "red",
          fillColor: "transparent",
          fillOpacity: 0.1,
        }).addTo(map);

        map.fitBounds(highlightedAreaLayer.getBounds());
      }
    }
  }
});

function getZoneNameById(zoneId, zoneData) {
  var filteredZone = zoneData.filter(function (zone) {
    return zone.zone_id === zoneId;
  });

  if (filteredZone.length > 0) {
    return filteredZone[0].zone_name;
  } else {
    return "";
  }
}

function getWardNameById(wardId, wardData) {
  var filteredWard = wardData.filter(function (ward) {
    return ward.ward_id === wardId;
  });

  if (filteredWard.length > 0) {
    return filteredWard[0].ward_name;
  } else {
    return "";
  }
}
// You can also customize the scale options
L.control.scale().addTo(map);

var northArrowControl = L.Control.extend({
  options: {
    position: "bottomleft",
  },

  onAdd: function (map) {
    var container = L.DomUtil.create("div", "leaflet-bar leaflet-control");
    container.innerHTML =
      // '<div class="north-arrow" ><i class="fas fa-long-arrow-alt-up p-1"  style="width: 20px; background-color:white;  height: 20px;"></i></div>';
      '<img  src="png/002-cardinal-point.png" alt="" style="width: 30px;  height:50px; border:2px solid darkblue; background:white; border-radius:5px;">';

    return container;
  },
});
map.addControl(new northArrowControl());

// Now continue with your remaining JavaScript code...
// GeoServer URL
var geoserverUrl = "https://iwmsgis.pmc.gov.in/geoserver";

var workspace = "Road";

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
    div.innerHTML = "";

    // Fetch capabilities to get all layers in the 'pmc' workspace
    fetch(
      geoserverUrl + "/ows?service=wms&version=1.3.0&request=GetCapabilities"
    )
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
          if (
            layerWorkspace === workspace &&
            !processedLayers.includes(layerName)
          ) {
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
  div.addEventListener("click", toggleLegend);

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
      legendDiv.style.height === "0px" ||
      legendDiv.style.display === "none"
    ) {
      legendDiv.style.display = "block";
      legendDiv.style.height = "40vh";
      legendDiv.style.width = "200px";
      legendDiv.style.top = "12%";
      legendDiv.style.right = "2%";
      legendDiv.style.scrollbarWidth = "thin";
      legendDiv.style.scrollbarColor = "#163140 white";
      // legendDiv.style.borderRadius= "20px";
      legendDiv.style.boxShadow = "5px 5px 5px rgba(0, 0, 0, 0.7)"; // Add shadow
      button.innerHTML =
        "<i class='fa-solid fa-list' style='color:darkblue;'></i>";

      button.style.backgroundColor = "white"; // Change color to indicate action
      legendVisible = true;
    } else {
      legendDiv.style.display = "none";
      button.innerHTML =
        "<i class='fa-solid fa-list' style='color:darkblue;'></i>";
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
        if (layerName.startsWith("Road:")) {
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
      // div.style.borderRadius = "10px";
      div.style.padding = "10px";
    })
    .catch((error) => {
      console.error("Error fetching capabilities:", error);
    });

  return div;
};

legend.addTo(map);
