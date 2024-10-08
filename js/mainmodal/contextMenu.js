map.on("contextmenu", (e) => {
    let size = map.getSize();
    let bbox = map.getBounds().toBBoxString();
    let layer = "pmc:Data";
    let style = "pmc:Data";
    let urrr = `https://iwmsgis.pmc.gov.in//geoserver/pmc/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(
      e.containerPoint.x
    )}&Y=${Math.round(e.containerPoint.y)}&SRS=EPSG%3A4326&WIDTH=${
      size.x
    }&HEIGHT=${size.y}&BBOX=${bbox}`;
  
    if (urrr) {
      fetch(urrr)
        .then((response) => response.json())
        .then((html) => {
          var htmldata = html.features[0].properties;
          let keys = Object.keys(htmldata);
          let values = Object.values(htmldata);
          let txtk1 = "";
          var xx = 0;
          for (let gb in keys) {
            txtk1 +=
              "<tr><td>" + keys[xx] + "</td><td>" + values[xx] + "</td></tr>";
            xx += 1;
          }
  
          let detaildata1 =
            "<div style='max-height: 350px; max-width:200px;'><table  style='width:80%;' class='popup-table' >" +
            txtk1 +
            "</td></tr><tr><td>Co-Ordinates</td><td>" +
            e.latlng +
            "</td></tr></table></div>";
  
          L.popup().setLatLng(e.latlng).setContent(detaildata1).openOn(map);
        });
    }
  });