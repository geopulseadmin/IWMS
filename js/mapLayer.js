var map, geojson;

var map = L.map("map", {
  center:[18.52, 73.89],
  zoom: 11.66,
  minZoom: 10,
  maxZoom: 19,
  preferCanvas:true,
  boxZoom: true,
  trackResize: true,
  wheelPxPerZoomLevel: 40,
  zoomAnimation: true,
  zoomSnap: 0.2, 
  zoomDelta: 0.3, 
  fadeAnimation: true,
  zoomAnimationThreshold: 10,
  bounceAtZoomLimits: true,
  inertia: true      
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

var wms_layer1 = L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms",
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

var wms_layer11 = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "Reservations",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  });

var wms_layer13 = L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms",
  {
    layers: "Drainage_data",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
);

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

var Geotagged = L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms",
  {
    layers: "output_data",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
).addTo(map);



 
var Geotaggedlive = L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in/geoserver/PMC_test/wms",
  {
    layers: "geotagphoto",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  }
).addTo(map);



var IWMS_point = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "IWMS_point",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
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

  var IWMS_polygon = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "IWMS_polygon",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  });

  var GIS_Ward_Layer = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "GIS_Ward_Layer",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  });
  
  var Geodata = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "Geodata",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,
    opacity: 1,
  });
  var wms_layer21 = L.tileLayer
  .wms("https://iwmsgis.pmc.gov.in/geoserver/pmc/wms", {
    layers: "Bhavan",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    maxZoom: 21,

    opacity: 1,
  });

var wms_layer16 = L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms",
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

var wardname = localStorage.getItem("wardname");
console.log(wardname, "wardname");

var ward_boundary= L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms",
  {
    layers: "ward_boundary1",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1,
    maxZoom: 21,
  }
);

var Zone_layer= L.tileLayer.wms(
  "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms",
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

var WMSlayers = {
  "OSM": osm,
  "Esri": Esri_WorldImagery,
  "Satellite": googleSat,
  Boundary: wms_layer12,
  Data: wms_layer14,
  Revenue: wms_layer15,
  Village: wms_layer17,
  PMC: wms_layer3,
  Amenity: wms_layer11,
  
  Bhavan: wms_layer21,
  Drainage: wms_layer13,
  Roads: wms_layer1,
  OSMRoad: wms_layer16,
  GIS_Ward_Layer: GIS_Ward_Layer,
  Geodata:Geodata,
  "IWMS Point": IWMS_point,
  "IWMS Line": IWMS_line,
  "IWMS Polygon": IWMS_polygon,
  "GIS Ward Layer": GIS_Ward_Layer,
  Geotagged: Geotagged,
  Geotaggedlive:Geotaggedlive,
};

var control = new L.control.layers(baseLayers, WMSlayers).addTo(map);
control.setPosition('topright');


// kml


map.on("dblclick", function (e) {
  let size = map.getSize();
  let bbox = map.getBounds().toBBoxString();
  let layer = "pmc:Data";
  let style = "pmc:Data";
  let urrr = `https://iwmsgis.pmc.gov.in/geoserver/pmc/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(
    e.containerPoint.x
  )}&Y=${Math.round(e.containerPoint.y)}&SRS=EPSG%3A4326&WIDTH=${size.x
    }&HEIGHT=${size.y}&BBOX=${bbox}`;

 

  if (urrr) {
    fetch(urrr)
      .then((response) => response.json())
      .then((html) => {
        // var htmldata = html.features[0].properties;
        if (html.features && html.features.length > 0) {
          var htmldata = html.features[0].properties;

          var geometryType = html.features[0].geometry.type;
          console.log(geometryType, "geometryType");

          if (geometryType === "MultiPolygon" || geometryType === "Polygon") {
            var coordinatesArray = html.features[0].geometry.coordinates[0][0];
          } else if (
            geometryType === "MultiLineString" ||
            geometryType === "LineString"
          ) {
            var coordinatesArray = html.features[0].geometry.coordinates[0];
          } else if (
            geometryType === "MultiPoint" ||
            geometryType === "Point"
          ) {
            var coordinatesArray = html.features[0].geometry.coordinates;
          }

          var coordinatesWithAltitude = coordinatesArray.map(function (coord) {
            return [coord[0].toFixed(15), coord[1].toFixed(15), 0];
          });



          function generateKML(geometryType, coordinatesArray) {
            var kml = `<?xml version="1.0" encoding="UTF-8"?>
                      <kml xmlns="http://www.opengis.net/kml/2.2" xmlns:gx="http://www.google.com/kml/ext/2.2" xmlns:kml="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">
                      <Document>
                          <name>UPolygon.kml</name>
                          <StyleMap id="m_ylw-pushpin">
                              <Pair>
                                  <key>normal</key>
                                  <styleUrl>#s_ylw-pushpin</styleUrl>
                              </Pair>
                              <Pair>
                                  <key>highlight</key>
                                  <styleUrl>#s_ylw-pushpin_hl</styleUrl>
                              </Pair>
                          </StyleMap>
                          <Style id="s_ylw-pushpin">
                              <IconStyle>
                                  <scale>1.1</scale>
                                  <Icon>
                                      <href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
                                  </Icon>
                                  <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
                              </IconStyle>
                              <LineStyle>
                                  <color>ff00ff00</color>
                                  <width>5</width>
                              </LineStyle>
                              <PolyStyle>
                                  <color>80ffffff</color>
                              </PolyStyle>
                          </Style>
                          <Style id="s_ylw-pushpin_hl">
                              <IconStyle>
                                  <scale>1.3</scale>
                                  <Icon>
                                      <href>http://maps.google.com/mapfiles/kml/pushpin/ylw-pushpin.png</href>
                                  </Icon>
                                  <hotSpot x="20" y="2" xunits="pixels" yunits="pixels"/>
                              </IconStyle>
                              <LineStyle>
                                  <color>ff00ff00</color>
                                  <width>5</width>
                              </LineStyle>
                              <PolyStyle>
                                  <color>80ffffff</color>
                              </PolyStyle>
                          </Style>`;

            if (geometryType === "MultiPolygon" || geometryType === "Polygon") {
              kml += `<Placemark>
                      <name>Untitled Polygon</name>
                      <styleUrl>#m_ylw-pushpin</styleUrl>
                      <Polygon>
                          <tessellate>1</tessellate>
                          <outerBoundaryIs>
                              <LinearRing>
                                  <coordinates>
                                  ${coordinatesArray.join(" ")}
                                  </coordinates>
                              </LinearRing>
                          </outerBoundaryIs>
                      </Polygon>
                    </Placemark>`;
            } else if (
              geometryType === "MultiLineString" ||
              geometryType === "MultiLineString"
            ) {
              kml += `<Placemark>
                      <name>Untitled Line</name>
                      <styleUrl>#m_ylw-pushpin</styleUrl>
                      <LineString>
                          <tessellate>1</tessellate>
                          <coordinates>
                          ${coordinatesArray.join(" ")}
                          </coordinates>
                      </LineString>
                    </Placemark>`;
            } else if (
              geometryType === "MultiPoint" ||
              geometryType === "Point"
            ) {
              kml += `<Placemark>
                      <name>Untitled Point</name>
                      <styleUrl>#m_ylw-pushpin</styleUrl>
                      <Point>
                        <coordinates>
                          ${coordinatesArray.join(", ")}
                        </coordinates>
                      </Point>
                    </Placemark>`;
            }

            kml += `</Document>
                  </kml>`;

            return kml;
          }

          var kmlContent = generateKML(geometryType, coordinatesWithAltitude);
          console.log(kmlContent, "kmlContent");
        }

        var ssDownload = document.createElement("a");
        ssDownload.href =
          "data:application/vnd.google-earth.kml+xml;charset=utf-8," +
          encodeURIComponent(kmlContent);
        ssDownload.download = "polygon.kml";
        ssDownload.textContent = "Download KML";
        var lat = e.latlng.lat;
        var lng = e.latlng.lng;
        var ssOpenInGoogleEarth = document.createElement("a");
        ssOpenInGoogleEarth.href =
          "https://earth.google.com/web/search/" + lat + "," + lng;
        ssOpenInGoogleEarth.target = "_blank";
        ssOpenInGoogleEarth.textContent = "Open in Google Earth";
        var ssOpenInGoogleMap = document.createElement("a");
        ssOpenInGoogleMap.href =
          "https://www.google.com/maps?q=" + lat + "," + lng;
        ssOpenInGoogleMap.target = "_blank";
        ssOpenInGoogleMap.textContent = "Open in Google Map";

        // Create a div element to hold the links
        var container = L.DomUtil.create("div");
        container.appendChild(ssDownload);
        container.appendChild(document.createElement("br")); 
        container.appendChild(ssOpenInGoogleEarth);
        container.appendChild(document.createElement("br")); 
        container.appendChild(ssOpenInGoogleMap);

        // Create a Leaflet popup and set its content to the container
        var popup = L.popup()
          .setLatLng(e.latlng)
          .setContent(container)
          .openOn(map);
      });
  }
});




function SavetoKML() {
  var kmlContent = toKMLFormat(); // Get KML data
  var blob = new Blob([kmlContent], {
    type: "application/vnd.google-earth.kml+xml",
  }); 
  
  var a = document.createElement("a");
  a.href = window.URL.createObjectURL(blob);
  a.download = "output.kml"; 
 
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function toGISformat() {
  var table = document.getElementById("popup-table");

  // Create an object to hold the data
  var data = {};

  // Loop through the rows
  for (var i = 0; i < table.rows.length; i++) {
    var row = table.rows[i];

    // Get property name from the first column
    var propertyName = row.cells[0].textContent.trim();

    // Get value from the second column
    var inputElement = row.cells[1].querySelector("input");
    var propertyValue = inputElement
      ? inputElement.value
      : row.cells[1].textContent.trim();

    // Assign the property only if it has a valid name
    if (propertyName) {
      data[propertyName] = propertyValue;
    }
  }

  

  // Get GeoJSON representation of the drawn layer
  var geoJSON = drawnItems.toGeoJSON();

  // Add properties data to GeoJSON features
  for (var k = 0; k < geoJSON.features.length; k++) {
    var feature = geoJSON.features[k];

    // Check if the feature has properties
    if (!feature.properties) {
      feature.properties = {};
    }

    // Assign the data properties to GeoJSON feature properties
    for (var key in data) {
      feature.properties[key] = data[key];
    }
  }

  // Convert GeoJSON to a string
  var geoJSONString = JSON.stringify(geoJSON, null, 2);
  return geoJSONString;
}

function toKMLFormat() {
  var table = document.getElementById("popup-table");
  var data = {};

  // Loop through the rows
  for (var i = 0; i < table.rows.length; i++) {
    var row = table.rows[i];
    var propertyName = row.cells[0].textContent.trim();
    var inputElement = row.cells[1].querySelector("input");
    var propertyValue = inputElement
      ? inputElement.value
      : row.cells[1].textContent.trim();

    if (propertyName) {
      data[propertyName] = propertyValue;
    }
  }

  // Initialize KML content with KML opening tag
  var kmlContent = '<?xml version="1.0" encoding="UTF-8"?>\n';
  kmlContent += '<kml xmlns="http://www.opengis.net/kml/2.2">\n';
  kmlContent += "<Document>\n";

  // Loop through the features and add Placemark for each feature
  var geoJSON = drawnItems.toGeoJSON();
  for (var k = 0; k < geoJSON.features.length; k++) {
    var feature = geoJSON.features[k];
    kmlContent += "<Placemark>\n";
    kmlContent += "<name>" + (data["name"] || "Untitled") + "</name>\n"; // Set name for the Placemark
    kmlContent += "<description><![CDATA[\n";
    // Add property data to the description
    for (var prop in data) {
      kmlContent += "<b>" + prop + ":</b> " + data[prop] + "<br>\n";
    }
    kmlContent += "]]></description>\n";

    // Check if the feature is a LineString or Polygon
    if (feature.geometry.type === "LineString") {
      kmlContent += "<LineString>\n";
    } else if (feature.geometry.type === "Polygon") {
      kmlContent += "<Polygon>\n";
    }
    if (feature.geometry.type === "LineString") {
      kmlContent += "<coordinates>\n";
    } else if (feature.geometry.type === "Polygon") {
      kmlContent += "<outerBoundaryIs>\n<LinearRing>\n<coordinates>\n";
    }
    // Loop through coordinates of the geometry
    if (feature.geometry.type === "LineString") {
      var coordinates = feature.geometry.coordinates;
    } else if (feature.geometry.type === "Polygon") {
      var coordinates = feature.geometry.coordinates[0];
    }
    for (var i = 0; i < coordinates.length; i++) {
      kmlContent += coordinates[i][0] + "," + coordinates[i][1] + "\n";
    }
    if (feature.geometry.type === "LineString") {
      kmlContent += "</coordinates>\n";
    } else if (feature.geometry.type === "Polygon") {
      kmlContent += "</coordinates>\n</LinearRing>\n</outerBoundaryIs>\n";
    }
    if (feature.geometry.type === "LineString") {
      kmlContent += "</LineString>\n";
    } else if (feature.geometry.type === "Polygon") {
      kmlContent += "</Polygon>\n";
    }

    kmlContent += "</Placemark>\n";
  }

  // Close KML Document and KML tags
  kmlContent += "</Document>\n";
  kmlContent += "</kml>";

  return kmlContent;
}

