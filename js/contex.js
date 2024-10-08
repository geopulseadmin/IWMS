

 
const layerDetails = {
    "pmc:IWMS_polygon": ["Work_ID", "Name_of_Work", "project_fi", "Department", "Work_Type", "Project_Office", "zone", "ward", "Tender_Amount", "Name_of_JE", "Contact_Number", "GIS_Created_At"],
    "pmc:IWMS_point": ["Work_ID", "Name_of_Work", "project_fi", "Department", "Work_Type", "Project_Office", "zone", "ward", "Tender_Amount", "Name_of_JE", "Contact_Number", "GIS_Created_At"],
    "pmc:IWMS_line": ["Work_ID", "Name_of_Work", "project_fi", "Department", "Work_Type", "Project_Office", "zone", "ward", "Tender_Amount", "Name_of_JE", "Contact_Number", "GIS_Created_At"],
  };
   
  function getCheckedValuesforpopuups() {
    return new Promise((resolve, reject) => {
      var selectedValues = {};
      const filternames = ["Project_Office", "project_fi", "zone", "ward", "Department", "stage", "village", "Work_Type"];
   
      filternames.forEach(function (filtername) {
        selectedValues[filtername] = []; // Initialize empty array for each filtername
   
        $('#' + filtername + ' input[type="checkbox"]:checked').each(function () {
          var single_val = $(this).val();
          if (single_val) {
            var actualValue = single_val.split(' (')[0];
            selectedValues[filtername].push(actualValue);
          }
        });
      });
   
      var filters = [];
      for (var key in selectedValues) {
        if (selectedValues[key].length > 0) {
          filters.push(`${key} IN ('${selectedValues[key].join("','")}')`);
        }
      }
   
      var filterString = filters.join(" AND ");
      resolve(filterString);
    });
  }
   
  function combineFilters(cql_filter123, filterString) {
    return `${cql_filter123} AND ${filterString}`;
  }
   
  // console.log("hehehe")
   
  map.on("contextmenu", async (e) => {
    let bbox = map.getBounds().toBBoxString();
  let size = map.getSize();
   
  let daterangeValue = $('#daterange').val();
  let dates = daterangeValue.split(' - ');
  let startDate = moment(dates[0], 'MMMM D, YYYY').format('YYYY-MM-DD');
  let endDate = moment(dates[1], 'MMMM D, YYYY').format('YYYY-MM-DD');
   
  // console.log("{{{{{{================")
  let filterString = await getCheckedValuesforpopuups();
   
  var searchtypefield = $("#search_type").val();
  var searchtypefield1 = $("#searchInputDashboard").val();
   
  let cqlFilter123 = "";
   
  if (searchtypefield1) {
    cqlFilter123 = `${searchtypefield} IN ('${searchtypefield1}')`;
  } else {
    cqlFilter123 = `conc_appr_ >= '${startDate}' AND conc_appr_ < '${endDate}'`;
   
    if (filterString.trim() !== "") {
      cqlFilter123 = combineFilters(cqlFilter123, filterString);
    }
  }
   
  console.log(cqlFilter123, "cqlFilter123");
   
   
    for (let layer in layerDetails) {
      let selectedKeys = layerDetails[layer];
      let urrr = `${main_url}pmc/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(e.containerPoint.x)}&Y=${Math.round(e.containerPoint.y)}&SRS=EPSG%3A4326&WIDTH=${size.x}&HEIGHT=${size.y}&BBOX=${bbox}&CQL_FILTER=${cqlFilter123}`;
   
      try {
        let response = await fetch(urrr);
        let html = await response.json();
        var htmldata = html.features[0].properties;
        let txtk1 = "";
        for (let key of selectedKeys) {
          if (htmldata.hasOwnProperty(key)) {
            let value = htmldata[key];
            txtk1 += "<tr><td>" + key + "</td><td>" + value + "</td></tr>";
          }
        }
   
        let detaildata1 = "<div style='max-height: 350px; max-height: 250px;'><table style='width:110%;' class='popup-table'>" + txtk1 + "</td></tr><tr><td>Co-Ordinates</td><td>" + e.latlng + "</td></tr></table></div>";
        L.popup().setLatLng(e.latlng).setContent(detaildata1).openOn(map);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  });
   
  