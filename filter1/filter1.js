var map, geojson;
const API_URL = "http://localhost/IWMS/";

var map = L.map("map", {
  center:[18.52, 73.89],
  zoom: 11,
  minZoom:10,
  maxZoom:19,
  zoomSnap:0.5,
  zoomDelta:0.5,
});

var googleSat = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
  {
    maxZoom: 21,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom:19,
}).addTo(map);

var Esri_WorldImagery = L.tileLayer(
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
  {
    maxZoom:19.9,
  }
);
var baseLayers = {};



var wms_layer12 = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "PMC_Boundary",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
      }).addTo(map);



var wms_layer14 = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "Data",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  });

var wms_layer15 = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "Revenue",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  });

var wms_layer17 = L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms",
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
  "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms",
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



var IWMS_point = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "IWMS_point",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    // attribution: "DP_Roads",
    opacity: 1,
    maxZoom: 21,
  });

var IWMS_line = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "IWMS_line",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  });



var ward_boundary= L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms",
  {
    layers: "ward_boundary1",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    // attribution: "geodata",
    opacity: 1,
    maxZoom: 21,
  }
);



var WMSlayers = {
  "OSM": osm,
  "Esri": Esri_WorldImagery,
  "Satellite": googleSat,
  Boundary: wms_layer12,
  Data: wms_layer14,
  Revenue: wms_layer15,
  Village: wms_layer17,
  PMC: wms_layer3,
};


var control = new L.control.layers(baseLayers, WMSlayers).addTo(map);
control.setPosition('topright');



function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("mySidenav").style.height = "410px";
    document.getElementById("mySidenav").style.zIndex = "99999";
    document.getElementById("mySidenav").style.borderColor = "#383899";
    document.getElementById("mySidenav").style.top = "70px";
    document.getElementById("mySidenav").style.scrollbarWidth = "thin";

    document.getElementById("content").style.marginLeft = "0";
    document.getElementById("content").style.zIndex = "0";

  }

  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("content").style.marginLeft = "0";
  }


  $(function () {
    $("#mySidenav").draggable();
  });



  $(document).ready(function () {
    loadInitialData();
});

function loadInitialData(){
    loadProjectFi(function(Uniqueguts) {
        var stateList = $('#project_Off');
        stateList.empty();
        Uniqueguts.forEach(function (state) {
            var listItem = $('<li><input name="' + state + '" type="checkbox"><label for="' + state + '">' + state + '</label></li>');
            stateList.append(listItem);
        });

        $('.dropdown-container')
            .on('click', '.dropdown-button', function () {
                $(this).siblings('.dropdown-list').toggle();
            })
            .on('input', '.dropdown-search', function () {
                var target = $(this);
                var dropdownList = target.closest('.dropdown-list');
                var search = target.val().toLowerCase();

                if (!search) {
                    dropdownList.find('li').show();
                    return false;
                }

                dropdownList.find('li').each(function () {
                    var text = $(this).text().toLowerCase();
                    var match = text.indexOf(search) > -1;
                    $(this).toggle(match);
                });
            })
            .on('change', '[type="checkbox"]', function () {
                var container = $(this).closest('.dropdown-container');
                var numChecked = container.find('[type="checkbox"]:checked').length;
                container.find('.quantity').text(numChecked || 'Any');
            });
    });
}

function loadProjectFi(callback) {
    var geoServerURL = "https://iwmsgis.pmc.gov.in//geoserver/pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=IWMS_point&propertyName=Project_Office&outputFormat=application/json";
    
    $.getJSON(geoServerURL, function (data) {
        var gutvalues = new Set();
        $.each(data.features, function (index, feature) {
            var gutss = feature.properties.Project_Office;
            gutvalues.add(gutss);
        });
        var Uniqueguts = Array.from(gutvalues);
        console.log(Uniqueguts)
        if (callback && typeof callback === "function") {
            callback(Uniqueguts);
        }
    });
}
