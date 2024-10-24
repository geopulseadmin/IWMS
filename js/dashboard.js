var main_url = "https://iwmsgis.pmc.gov.in/geoserver/"

function toggleFilter(label) {
  const input = label.nextElementSibling; // Get the input element next to the label
  const ul = input.nextElementSibling; // Get the ul element next to the input

  // Toggle 'active' class for the clicked filter input and its associated ul
  input.classList.toggle('active');
  ul.classList.toggle('active');

}

// Function to close filter groups when clicking outside
document.addEventListener('click', function (event) {
  if (!event.target.closest('.filter-group')) {
    document.querySelectorAll('.filter-input').forEach(filterInput => {
      filterInput.classList.remove('active');
      filterInput.nextElementSibling.classList.remove('active');
    });
  }
});

// Function to filter checkboxes based on search input
function filterCheckboxes(input) {
  const filter = input.value.toLowerCase();
  const ul = input.nextElementSibling;
  const li = ul.getElementsByTagName('li');

  for (let i = 0; i < li.length; i++) {
    const text = li[i].textContent || li[i].innerText;
    if (text.toLowerCase().indexOf(filter) > -1) {
      li[i].style.display = "";
    } else {
      li[i].style.display = "none";
    }
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Add event listeners to filter inputs
  document.querySelectorAll('.filter-input').forEach(input => {
    input.addEventListener('input', function (event) {
      event.stopPropagation(); // Stop event propagation
      filterCheckboxes(this);
    });
    // Stop event propagation for click events on the input element
    input.addEventListener('click', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
    // Stop event propagation for mousedown events on the input element to prevent the div from closing
    input.addEventListener('mousedown', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
  });

  // Add event listeners to checkboxes to stop propagation
  document.querySelectorAll('.filter-group input[type="checkbox"]').forEach(checkbox => {
    checkbox.addEventListener('click', function (event) {
      event.stopPropagation(); // Stop event propagation
    });
  });
});
// toggleFilterend---------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const filters = document.getElementById('filters');
  const map = document.getElementById('map');
  const tableBtn = document.getElementById('openTableBtn');
  const tableinfo = document.getElementById('tablecontainer');

  const button = document.getElementById('toggleFilters');

  // Set the title attribute
  button.setAttribute('title', 'Filter');
  let filtersVisible = false;
  button.addEventListener('click', function () {
    if (!filtersVisible) {
      filters.style.marginLeft = '0';
      filters.style.opacity = '1';
      map.style.width = '81vw';
      button.style.top = "15vh";
      button.style.right = 'calc(0.8vw )';
      button.innerHTML = '<i class="fa-solid fa-filter-circle-xmark"></i>';
      tableBtn.style.right = 'calc(0.8vw)';
      tableBtn.style.top = '22vh';
      tableinfo.style.right = 'calc(20vw - 1px)';
    } else {
      filters.style.marginLeft = '-35vw';
      filters.style.opacity = '0';
      map.style.width = '100vw';
      button.style.top = "15vh";
      // button.style.right = '40px';
      button.style.right = '10px';
      button.innerHTML = '<i class="fa-solid fa-filter"></i>';
      tableBtn.style.right = '40px';
      tableBtn.style.top = '22vh';
      tableBtn.style.right = '10px';
      tableinfo.style.right = '10px'; // Adjusted position for tableinfo
    }
    filtersVisible = !filtersVisible;
  });
  // -------------------------------------------------------------------------
});
function updateTableStats(stats) {
  document.getElementById('tablestats').innerText = stats;
}

// --------------------------------------------------------------------
$(document).ready(function () {
  // Example usage of the function
  const layername = "pmc:IWMS_polygon,pmc:IWMS_line,pmc:IWMS_point";
  const main_url = "https://iwmsgis.pmc.gov.in/geoserver/";

  var start = moment('2024-04-01');
  var end = moment();
  var cql_filter1; // Declare the variable in the outer scope

  $('#daterange').daterangepicker({
    opens: 'left',
    locale: {
      format: 'MMMM D, YYYY' // Format to show Month name, Day, and Year
    },
    startDate: moment('2024-04-01'), // Set the start date to April 1st, 2024
    endDate: moment('2025-03-31'),   // Set the end date to March 31st, 2025
    ranges: {
      'Last 7 Days': [moment().subtract(6, 'days'), moment()],
      'This Month': [moment().startOf('month'), moment().endOf('month')],
      'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
      '2024-2025': [moment('2024-04-01'), moment('2025-03-31')],
      '2023-2024': [moment('2023-04-01'), moment('2024-03-31')],
      '2022-2023': [moment('2022-04-01'), moment('2023-03-31')],
      '2021-2022': [moment('2021-04-01'), moment('2022-03-31')],
    }
  }, cb);
  cb(start, end);

  async function cb(start, end) {
    // $('#daterange').val(start.format('2023') + ' - ' + end.format('YYYY'));
    var formattedStartDate = start.format('M/D/YY, h:mm A');
    var formattedEndDate = end.format('M/D/YY, h:mm A');
    cql_filter1 = `conc_appr_ >= '${formattedStartDate}' AND conc_appr_ < '${formattedEndDate}'`;
    console.log(cql_filter1, "lll")

    await DataTableFilter(cql_filter1)

    loadinitialData(cql_filter1);


    console.log(cql_filter1, "cql_filter1")
    getCheckedValues(function (filterString) {
      const mainfilter = combineFilters(cql_filter1, filterString);
      console.log("Main Filterfor checking:", mainfilter);
      FilterAndZoom(mainfilter);
      fitbous(mainfilter)
      DataTableFilter(mainfilter)
    });
  }
  $('#calendarIcon').on('click', function () {
    $('#daterange').click();
  });
  $('#daterange').on('apply.daterangepicker', function (ev, picker) {
    var startDate = picker.startDate.format('YYYY-MM-DD');
    var endDate = picker.endDate.format('YYYY-MM-DD');
    console.log('Selected date range:', startDate, 'to', endDate);
    cql_filter1 = `conc_appr_ >= '${startDate}' AND conc_appr_ < '${endDate}'`;
    loadinitialData(cql_filter1);
    const cql_filter = getCqlFilter();
    getCheckedValues(function (filterString) {
      const mainfilter = combineFilters(cql_filter1, filterString);
      console.log("Main Filterfor checking:", mainfilter);
      FilterAndZoom(mainfilter);
      fitbous(mainfilter)
      DataTableFilter(mainfilter);
    });
  });

  // Function to get cql_filter1 value
  function getCqlFilter() {
    return cql_filter1;
  }

  function loadinitialData(cql_filter) {
    FilterAndZoom(cql_filter)
    const filternames = ["Project_Office", "project_fi", "zone", "ward", "Department", "stage", "Work_Type"]; //accordn column names , if want add one more filter criteria add here

    filternames.forEach(function (filtername) {
      var url = `${main_url}pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=IWMS_line,IWMS_point,IWMS_polygon,GIS_Ward_Layer&propertyName=${filtername}&outputFormat=application/json&cql_filter=${encodeURIComponent(cql_filter)}`;
      console.log(url);
      $.getJSON(url, function (data) {
        var projectFiSet = new Set();
        var projectFiMap = new Map();

        // Iterate through the features and add non-null values to the set
        $.each(data.features, function (index, feature) {
          var column_name = feature.properties[filtername];
          if (column_name !== null && column_name !== "#N/A") {
            if (projectFiMap.has(column_name)) {
              // projectFiMap.set(column_name, projectFiMap.get(column_name) + 1);
              projectFiMap.set(column_name, (projectFiMap.get(column_name) || 0) + 1);
            } else {
              projectFiMap.set(column_name, 1);
            }
          }
        });
        // var uniqueProjectFiList = Array.from(projectFiMap.entries()).map(([name, count]) => `${name} (${count})`);
        var uniqueProjectFiList = Array.from(projectFiMap.entries()).map(([name]) => `${name}`);
        populateDropdown(filtername, uniqueProjectFiList);
      });
    });

    // FilterAndZoom(cql_filter)
    fitbous(cql_filter)
  }

  function combineFilters(cql_filter123, filterString) {
    if (filterString !== null && filterString !== undefined && filterString !== '') {
      return `${cql_filter123} AND ${filterString}`;
    } else {
      return cql_filter123;
    }
  }

  function initialize() {

    $('#daterange').on('apply.daterangepicker', function (ev, picker) {
      var startDate = picker.startDate.format('YYYY-MM-DD');
      var endDate = picker.endDate.format('YYYY-MM-DD');

      console.log('Selected date rangelooooooooooooooo:', startDate, 'to', endDate);

      cql_filter1 = `conc_appr_ >= '${startDate}' AND conc_appr_ < '${endDate}'`;

      loadinitialData(cql_filter1);
      const cql_filter = getCqlFilter();
      getCheckedValues(function (filterString) {


        const mainfilter = combineFilters(cql_filter1, filterString);
        console.log("Main Filterfor checking:", mainfilter);

        FilterAndZoom(mainfilter);
        fitbous(mainfilter)
        DataTableFilter(mainfilter)

      });
    });
  }

  initialize();
});

// -------------------------------------------

async function DataTableFilter(cql_filter1) {
  var layers = ["pmc:IWMS_line", "pmc:IWMS_point", "pmc:IWMS_polygon", "pmc:GIS_Ward_Layer"];
  var typeName = layers.join(',');
  var cqlFilter = cql_filter1;
  var geoServerURL =
    `${main_url}pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=application/json&CQL_FILTER=${encodeURIComponent(cqlFilter)}`;
  var headers = ['PID', 'Work_ID', 'Name_of_Work', 'Department', 'Budget_Code', 'Work_Type', 'Name_of_JE', 'Agency', 'stage', 'Tender_Amount', 'Project_Time', 'Status'];
  console.log(geoServerURL, "geoserver_url")
  await showtable(typeName, geoServerURL, cqlFilter, headers);

}

function populateDropdown(dropdownId, data) {
  var ul = $("#" + dropdownId);
  ul.empty();
  // var searchBox= $(' <input type="text" placeholder="Search" class="filter-input">')
  data.forEach(function (item) {
    // console.log(item, "items")
    var listItem = $('<li><label><input type="checkbox" class="select2-option-checkbox" value="' + item + '"> ' + item + '</label></li>');
    ul.append(listItem);
  });
}


function getCheckedValues(callback) {
  var selectedValues = {};
  const filternames = ["Project_Office", "project_fi", "zone", "ward", "Department", "stage", "village", "Work_Type"];

  filternames.forEach(function (filtername) {
    selectedValues[filtername] = []; // Initialize empty array for each filtername

    $('#' + filtername).on('click', 'input[type="checkbox"]', function (event) {
      event.stopPropagation();
      var values = [];
      $('#' + filtername + ' input[type="checkbox"]:checked').each(function () {
        var single_val = $(this).val();
        console.log(single_val, "single_val")
        if (single_val) {
          // Remove the count from the value
          var actualValue = single_val.split(' (')[0];
          values.push(actualValue);
        }
      });

      // Update selectedValues for the current filtername
      selectedValues[filtername] = values;

      // Construct filter strings for all filter names
      var filters = [];
      for (var key in selectedValues) {
        if (selectedValues[key].length > 0) {
          filters.push(`${key} IN ('${selectedValues[key].join("','")}')`);
        }
      }

      // Join all filter strings with "AND"
      var filterString = filters.join(" AND ");

      // Update the selected count in the label
      var label = $('label[for="' + filtername + '"]');
      if (label.length > 0) {
        var selectedCount = values.length;
        var countText = selectedCount > 0 ? ' (' + selectedCount + ')' : '';
        label.find('.selected-count').text(countText);
      }


      // Call the callback function with filterString
      if (typeof callback === 'function') {
        callback(filterString);
      }
    });
  });
}
function FilterAndZoom(filter) {

  IWMS_point.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
  }).addTo(map);
  IWMS_polygon.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
  }).addTo(map);
  IWMS_line.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
  }).addTo(map);
  GIS_Ward_Layer.setParams({
    CQL_FILTER: filter,
    maxZoom: 19.5,
  });


};


function fitbous(filter) {
  // Start the overall timer
  console.time("fitbous execution time");

  var layers = ["pmc:IWMS_point", "pmc:IWMS_line", "pmc:IWMS_polygon", "pmc:GIS_Ward_Layer"];
  var bounds = null;

  var promises = layers.map(function (layerName) {

    const urlm = `${main_url}ows?service=WFS&version=1.0.0&request=GetFeature&typeName=${layerName}&CQL_FILTER=${filter}&outputFormat=application/json&propertyName=geom`;

    // Return a promise for each layer
    return $.getJSON(urlm).then(function (data) {

      var bbox = turf.bbox(data); // Returns [minX, minY, maxX, maxY]

      var layerBounds = [[bbox[1], bbox[0]], [bbox[3], bbox[2]]];

      // Combine the bounds
      if (bounds) {
        bounds = bounds.extend(layerBounds);
      } else {
        bounds = L.latLngBounds(layerBounds);
      }

    });
  });

  // Execute all promises in parallel
  Promise.all(promises).then(function () {
    // Stop timer for data fetching (after all promises are resolved)
    console.timeEnd("Data fetching");

    if (bounds) {
      // Start timer for fitting bounds to the map
      console.time("Map fitting");

      // Apply the combined bounds to the map after all layers are processed
      map.fitBounds(bounds);

      // Stop timer for fitting bounds to the map
      console.timeEnd("Map fitting");
    }

    // Stop the overall timer
    console.timeEnd("fitbous execution time");
  });
}

// for dashboard table dynamic

// async function showtable(typeName, geoServerURL, cqlFilter, headers) {
//   tableData(typeName, geoServerURL, cqlFilter, headers);
//   var currentPage = 1;
//   var rowsPerPage = 10;
//   var buttonsToShow = 3;
//   function setupPagination(data, rowsPerPage, headers, tableContainer) {
//     var paginationContainer = document.createElement('div');
//     paginationContainer.id = 'pagination';
//     var pageCount = Math.ceil(data.length / rowsPerPage);
//     function renderPageButtons(startPage) {
//       paginationContainer.innerHTML = ""; // Clear any existing content
//       // Previous Button
//       var prevButton = document.createElement('button');
//       prevButton.innerText = 'Previous';
//       prevButton.disabled = currentPage === 1;
//       prevButton.addEventListener('click', function () {
//         if (currentPage > 1) {
//           currentPage--;
//           createTable(data, currentPage, rowsPerPage, headers);
//           renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
//         }
//       });
//       paginationContainer.appendChild(prevButton);
//       // Page Buttons
//       var endPage = Math.min(startPage + buttonsToShow - 1, pageCount);
//       for (var i = startPage; i <= endPage; i++) {
//         var pageButton = document.createElement('button');
//         pageButton.innerText = i;
//         if (i === currentPage) {
//           pageButton.classList.add('active');
//         }
//         pageButton.addEventListener('click', function (event) {
//           currentPage = Number(event.target.innerText);
//           createTable(data, currentPage, rowsPerPage, headers);
//           renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
//         });
//         paginationContainer.appendChild(pageButton);
//       }
//       // Next Button
//       var nextButton = document.createElement('button');
//       nextButton.innerText = 'Next';
//       nextButton.disabled = currentPage === pageCount;
//       nextButton.addEventListener('click', function () {
//         if (currentPage < pageCount) {
//           currentPage++;
//           createTable(data, currentPage, rowsPerPage, headers);
//           renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
//         }
//       });
//       paginationContainer.appendChild(nextButton);
//     }

//     renderPageButtons(1);
//     tableContainer.appendChild(paginationContainer); // Append paginationContainer after rendering buttons
//   }



//   function createTable(data, headers) {
//     var tableContainer = document.getElementById('tablecontainer');
//     if (!tableContainer) {
//       console.error("Table container not found");
//       return;
//     }
//     tableContainer.innerHTML = ""; // Clear any existing content

//     // Create minimize button
//     var minimizeButton = document.createElement('button');
//     minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
//     minimizeButton.className = 'minimize-button';
//     minimizeButton.addEventListener('click', function () {
//       var tableDetail = document.querySelector('.tableDetail');
//       if (tableDetail.style.display === 'none') {
//         tableDetail.style.display = 'block';
//         minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
//         document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
//       } else {
//         tableDetail.style.display = 'none';
//         minimizeButton.style.display = 'none';
//         document.getElementById('openTableBtn').style.display = 'block'; // Show the show button
//       }
//     });
//     tableContainer.appendChild(minimizeButton);

//     // Create tableDetail div
//     var tableDetail = document.createElement('div');
//     tableDetail.className = 'tableDetail';
//     tableContainer.appendChild(tableDetail);

//     var table = document.createElement('table');
//     table.className = 'data-table'; // Add a class for styling
//     table.id = 'data-table'; // Add an ID for DataTables initialization

//     var thead = document.createElement('thead');
//     var headerRow = document.createElement('tr');

//     headers.unshift('Sr_no'); // Add serial number column
//     // Create header cells
//     headers.forEach(headerText => {
//       var th = document.createElement('th');
//       th.textContent = headerText;

//       if (headerText === 'Name_of_Work') {
//         th.style.minWidth = '300px'; // Adjust as needed
//       }
//       headerRow.appendChild(th);


//     });

//     thead.appendChild(headerRow);
//     table.appendChild(thead);

//     var tbody = document.createElement('tbody');
//     // Populate table rows with data
//     data.forEach((item, index) => {
//       var row = document.createElement('tr');
//       // Add serial number as the first column
//       var serialNumberCell = document.createElement('td');
//       serialNumberCell.textContent = index + 1;
//       row.appendChild(serialNumberCell);

//       headers.slice(1).forEach(header => {
//         var cell = document.createElement('td');
//         if (header === 'Project_Time') {
//           let projectTime = item[header] ? moment(item[header]) : null;

//           if (projectTime && projectTime.isValid()) {
//             // Format the date for display
//             cell.textContent = projectTime.format('DD/MM/YYYY HH:mm');
//             // Store the raw date value for sorting
//             cell.setAttribute('data-sort', projectTime.toISOString());
//           } else {
//             // Handle invalid or missing dates
//             cell.textContent = 'N/A';
//             cell.setAttribute('data-sort', ''); // For empty sorting

//           }
//         } else {
//           cell.textContent = item[header] || ''; // Handle undefined values

//           if (header === 'Name_of_Work') {
//             cell.style.minWidth = '300px'; // Adjust as needed
//           }
//         }
//         row.appendChild(cell);
//       });

//       // Add click listener to highlight the geometry on the map
//       row.addEventListener('click', function () {
//         var boundsLayer = L.geoJSON(item.geometry, {
//           style: {
//             fillColor: "blue", // Fill color
//             fillOpacity: 0.3, // Fill opacity
//             color: "blue", // Border color
//             weight: 2, // Border weight
//           },
//         }).addTo(map); // Add the bounds layer to the map

//         var bounds = boundsLayer.getBounds();
//         map.fitBounds(bounds);

//         // Remove the bounds layer after 5 seconds
//         setTimeout(function () {
//           map.removeLayer(boundsLayer);
//         }, 5000);
//       });

//       tbody.appendChild(row);
//     });

//     table.appendChild(tbody);
//     tableDetail.appendChild(table);

//     // Initialize DataTables after rendering the table
//     $(document).ready(function () {
//       if ($.fn.DataTable.isDataTable('#data-table')) {
//         $('#data-table').DataTable().destroy(); // Destroy existing DataTable if initialized
//       }

//       // Find the index of 'Project_Time'
//       const projectTimeIndex = headers.indexOf('Project_Time');

//       $('#data-table').DataTable({
//         paging: true, // Enable pagination
//         lengthChange: true, // Enable the 'Show X entries' dropdown
//         searching: true, // Enable search box
//         ordering: true, // Enable column sorting
//         info: true, // Enable showing 'Showing X of Y entries' info
//         autoWidth: false, // Disable auto width calculation
//         scrollY: 400,
//         scrollX: true,
//         scrollCollapse: true,
//         fixedHeader: true,
//         order: [[projectTimeIndex, 'desc']], // Initial sort on the Project_Time column (latest first)
//         columnDefs: [
//           {
//             targets: projectTimeIndex, // Ensure this matches the index of the Project_Time column
//             type: 'date', // Ensure DataTables treats this column as a date
//             orderData: [projectTimeIndex], // Sort based on the raw date
//           }
//         ]
//       });
//     });
//   }


//   // Function to show the hidden table
//   function showTable() {
//     var tableDetail = document.querySelector('.tableDetail');
//     var minimizeButton = document.querySelector('.minimize-button');
//     tableDetail.style.display = 'block';
//     minimizeButton.style.display = 'block';
//     // minimizeButton.innerText = '-';
//     document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
//   }

//   // Add event listener to the show table button
//   document.getElementById('openTableBtn').addEventListener('click', showTable);


//   // -------------------------------------------------------------
//   function tableData(typeName, geoServerURL, cqlFilter, headers) {
//     $.getJSON(geoServerURL, function (data) {
//       var filteredData = data;

//       const pid = [];

//       // Filter out features where PID is null
//       var exampleData = filteredData.features
//         .filter(feature => feature.properties.PID !== null) // Filter out null PIDs
//         .map(feature => {
//           let mappedData = {};
//           headers.forEach(header => {
//             // Convert header to camelCase or other naming convention if necessary
//             let propertyName = header.replace(/ /g, ''); // Remove spaces for property names
//             mappedData[propertyName] = feature.properties[header]; // Map property correctly
//           });
//           mappedData.geometry = feature.geometry;
//           pid.push(feature.properties.PID);

//           // Ensure geometry is included
//           return mappedData;
//         });

//       const uniquePIDs = new Set(pid);

//       // Update the table stats with the count of unique PIDs
//       updateTableStats(`Total Projects:  ${uniquePIDs.size}`);

//       // console.log(exampleData,"before")
//       // Sort exampleData by Project_Time in descending order (latest first)
//       exampleData.sort((a, b) => {
//         // Access Project_Time using the mapped property name
//         let dateA = new Date(a.Project_Time); // Ensure this matches your header
//         let dateB = new Date(b.Project_Time);

//         // Handle invalid dates
//         if (isNaN(dateA)) return 1; // Treat invalid dates as later
//         if (isNaN(dateB)) return -1; // Treat invalid dates as earlier

//         return dateB - dateA; // Sort in descending order
//       });
//       // console.log(exampleData,"after")

//       // Create the table with the sorted data
//       createTable(exampleData, headers);
//     });
//   }
// };
// --------------------------------------
 
async function showtable(typeName, geoServerURL, cqlFilter, headers) {
  tableData(typeName, geoServerURL, cqlFilter, headers);
  var currentPage = 1;
  var rowsPerPage = 10;
  var buttonsToShow = 3;
  function setupPagination(data, rowsPerPage, headers, tableContainer) {
    var paginationContainer = document.createElement('div');
    paginationContainer.id = 'pagination';
    var pageCount = Math.ceil(data.length / rowsPerPage);
    function renderPageButtons(startPage) {
      paginationContainer.innerHTML = ""; // Clear any existing content
      // Previous Button
      var prevButton = document.createElement('button');
      prevButton.innerText = 'Previous';
      prevButton.disabled = currentPage === 1;
      prevButton.addEventListener('click', function () {
        if (currentPage > 1) {
          currentPage--;
          createTable(data, currentPage, rowsPerPage, headers);
          renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
        }
      });
      paginationContainer.appendChild(prevButton);
      // Page Buttons
      var endPage = Math.min(startPage + buttonsToShow - 1, pageCount);
      for (var i = startPage; i <= endPage; i++) {
        var pageButton = document.createElement('button');
        pageButton.innerText = i;
        if (i === currentPage) {
          pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', function (event) {
          currentPage = Number(event.target.innerText);
          createTable(data, currentPage, rowsPerPage, headers);
          renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
        });
        paginationContainer.appendChild(pageButton);
      }
      // Next Button
      var nextButton = document.createElement('button');
      nextButton.innerText = 'Next';
      nextButton.disabled = currentPage === pageCount;
      nextButton.addEventListener('click', function () {
        if (currentPage < pageCount) {
          currentPage++;
          createTable(data, currentPage, rowsPerPage, headers);
          renderPageButtons(Math.max(1, currentPage - Math.floor(buttonsToShow / 2)));
        }
      });
      paginationContainer.appendChild(nextButton);
    }
 
    renderPageButtons(1);
    tableContainer.appendChild(paginationContainer); // Append paginationContainer after rendering buttons
  }
 
 
 
  function createTable(data, headers) {
    var tableContainer = document.getElementById('tablecontainer');
    if (!tableContainer) {
      console.error("Table container not found");
      return;
    }
    tableContainer.innerHTML = ""; // Clear any existing content
 
    // Create minimize button
    var minimizeButton = document.createElement('button');
    minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
    minimizeButton.className = 'minimize-button';
    minimizeButton.addEventListener('click', function () {
      var tableDetail = document.querySelector('.tableDetail');
      if (tableDetail.style.display === 'none') {
        tableDetail.style.display = 'block';
        minimizeButton.innerHTML = '<i class="fas fa-minus"></i>';
        document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
      } else {
        tableDetail.style.display = 'none';
        minimizeButton.style.display = 'none';
        document.getElementById('openTableBtn').style.display = 'block'; // Show the show button
      }
    });
    tableContainer.appendChild(minimizeButton);
 
    // Create tableDetail div
    var tableDetail = document.createElement('div');
    tableDetail.className = 'tableDetail';
    tableContainer.appendChild(tableDetail);
 
    var table = document.createElement('table');
    table.className = 'data-table'; // Add a class for styling
    table.id = 'data-table'; // Add an ID for DataTables initialization
 
    var thead = document.createElement('thead');
    var headerRow = document.createElement('tr');
 
    headers.unshift('Sr_no'); // Add serial number column
    // Create header cells
    headers.forEach(headerText => {
      var th = document.createElement('th');
      th.textContent = headerText;
 
      if (headerText === 'Name_of_Work') {
        th.style.minWidth = '300px'; // Adjust as needed
      }
      headerRow.appendChild(th);
 
 
    });
 
    thead.appendChild(headerRow);
    table.appendChild(thead);
 
    var tbody = document.createElement('tbody');
    // Populate table rows with data
    data.forEach((item, index) => {
      var row = document.createElement('tr');
      // Add serial number as the first column
      var serialNumberCell = document.createElement('td');
      serialNumberCell.textContent = index + 1;
      row.appendChild(serialNumberCell);
 
      headers.slice(1).forEach(header => {
        var cell = document.createElement('td');
        if (header === 'Project_Time') {
          let projectTime = item[header] ? moment(item[header]) : null;
 
          if (projectTime && projectTime.isValid()) {
            // Format the date for display
            cell.textContent = projectTime.format('DD/MM/YYYY HH:mm');
            // Store the raw date value for sorting
            cell.setAttribute('data-sort', projectTime.toISOString());
          } else {
            // Handle invalid or missing dates
            cell.textContent = 'N/A';
            cell.setAttribute('data-sort', ''); // For empty sorting
 
          }
        } else {
          cell.textContent = item[header] || ''; // Handle undefined values
 
          if (header === 'Name_of_Work') {
            cell.style.minWidth = '300px'; // Adjust as needed
          }
        }
        row.appendChild(cell);
      });
 
      // Add click listener to highlight the geometry on the map
      row.addEventListener('click', function () {
        var boundsLayer = L.geoJSON(item.geometry, {
          style: {
            fillColor: "blue", // Fill color
            fillOpacity: 0.3, // Fill opacity
            color: "blue", // Border color
            weight: 2, // Border weight
          },
        }).addTo(map); // Add the bounds layer to the map
 
        var bounds = boundsLayer.getBounds();
        map.fitBounds(bounds);
 
        // Remove the bounds layer after 5 seconds
        setTimeout(function () {
          map.removeLayer(boundsLayer);
        }, 5000);
      });
 
      tbody.appendChild(row);
    });
 
    table.appendChild(tbody);
    tableDetail.appendChild(table);
 
    // Initialize DataTables after rendering the table
    $(document).ready(function () {
      if ($.fn.DataTable.isDataTable('#data-table')) {
        $('#data-table').DataTable().destroy(); // Destroy existing DataTable if initialized
      }
 
      // Find the index of 'Project_Time'
      const projectTimeIndex = headers.indexOf('Project_Time');
 
      $('#data-table').DataTable({
        paging: true, // Enable pagination
        lengthChange: true, // Enable the 'Show X entries' dropdown
        searching: true, // Enable search box
        ordering: true, // Enable column sorting
        info: true, // Enable showing 'Showing X of Y entries' info
        autoWidth: false, // Disable auto width calculation
        scrollY: 400,
        scrollX: true,
        scrollCollapse: true,
        fixedHeader: true,
        order: [[projectTimeIndex, 'desc']], // Initial sort on the Project_Time column (latest first)
        columnDefs: [
          {
            targets: projectTimeIndex, // Ensure this matches the index of the Project_Time column
            type: 'date', // Ensure DataTables treats this column as a date
            orderData: [projectTimeIndex], // Sort based on the raw date
          }
        ]
      });
    });
  }
 
 
  // Function to show the hidden table
  function showTable() {
    var tableDetail = document.querySelector('.tableDetail');
    var minimizeButton = document.querySelector('.minimize-button');
    tableDetail.style.display = 'block';
    minimizeButton.style.display = 'block';
    // minimizeButton.innerText = '-';
    document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
  }
 
  // Add event listener to the show table button
  document.getElementById('openTableBtn').addEventListener('click', showTable);
 
 
  // -------------------------------------------------------------
  function tableData(typeName, geoServerURL, cqlFilter, headers) {
    $.getJSON(geoServerURL, function (data) {
      var filteredData = data;
 
      const pid = [];
 
      const departmentData = {}; // To store by department
      const departmentTenderAmounts = {};
 
      // Filter out features where PID is null
      var exampleData = filteredData.features
        .filter(feature => feature.properties.PID !== null) // Filter out null PIDs
        .map(feature => {
          let mappedData = {};
          headers.forEach(header => {
            // Convert header to camelCase or other naming convention if necessary
            let propertyName = header.replace(/ /g, ''); // Remove spaces for property names
            mappedData[propertyName] = feature.properties[header]; // Map property correctly
          });
          mappedData.geometry = feature.geometry;
          pid.push(feature.properties.PID);
 
            // Aggregate tender amounts by department for pie chart
            const department = feature.properties.Department || 'Unknown'; // Replace 'Department' with actual property name
            // const tenderAmount = parseFloat(feature.properties.TenderAmount) || 0; // Replace 'TenderAmount' with actual property name
            if (!departmentData[department]) {
                departmentData[department] = 0;
            }
            departmentData[department] += 1; // Sum the tender amounts by department
 
             // Aggregate Tender_Amount by department for the bar chart
        const tenderAmount = parseFloat(feature.properties.Tender_Amount) || 0; // Replace with actual Tender_Amount property
        if (!departmentTenderAmounts[department]) {
          departmentTenderAmounts[department] = 0;
        }
        departmentTenderAmounts[department] += tenderAmount;
 
          // Ensure geometry is included
          return mappedData;
        });
 
      const uniquePIDs = new Set(pid);
 
      // Update the table stats with the count of unique PIDs
      updateTableStats(`Total Projects:  ${uniquePIDs.size}`);
 
      // console.log(exampleData,"before")
      // Sort exampleData by Project_Time in descending order (latest first)
      exampleData.sort((a, b) => {
        // Access Project_Time using the mapped property name
        let dateA = new Date(a.Project_Time); // Ensure this matches your header
        let dateB = new Date(b.Project_Time);
 
        // Handle invalid dates
        if (isNaN(dateA)) return 1; // Treat invalid dates as later
        if (isNaN(dateB)) return -1; // Treat invalid dates as earlier
 
        return dateB - dateA; // Sort in descending order
      });
      // console.log(exampleData,"after")
 
      // Create the table with the sorted data
      createTable(exampleData, headers);
 
      createDonutChart(departmentData); // Call to show chart alongside table
      createBarChart(departmentTenderAmounts); // Call to show bar chart
   
    });
  }
 
 
};
 
// // chart --------------------
// pie chart
function createDonutChart(departmentData) {
 
  const departmentColors = {
  "Road": "#FF004F",
    "Building": "#99EDC3",
    "Electric": " #FFE5B4",
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
    "Market":"yellow",
    "Encrochment": "#198754",
    "Sport":"#d63384",
  };
  // Convert the departmentData object to an array of [name, count] pairs
  const departmentArray = Object.entries(departmentData);
 
  // Sort the array by count in descending order
  departmentArray.sort((a, b) => b[1] - a[1]);
 
  // Extract the sorted department names and counts
  const sortedDepartmentNames = departmentArray.map(entry => entry[0]);
  const sortedDepartmentCounts = departmentArray.map(entry => entry[1]);
  // // Extract department names and counts
  const departmentNames = Object.keys(departmentData);
  // const departmentCounts = Object.values(departmentData);
 
  // Get the canvas element
  var ctx = document.getElementById('pieChart').getContext('2d');
 
  // Create a new donut chart
  new Chart(ctx, {
    type: 'doughnut', // Pie chart type
    data: {
      // labels: departmentNames,
      labels: sortedDepartmentNames,
      datasets: [{
        label: 'Department Counts',
        // data: departmentCounts,
        data: sortedDepartmentCounts,
        backgroundColor: sortedDepartmentNames.map(name => departmentColors[name] || '#ccc'),
        hoverOffset: 4,
      }],
    },
    options: {
      responsive: true,
      cutoutPercentage: 40, // Makes it a donut chart
      plugins: {
        legend: {
       
          position: 'bottom',
          labels: {
            font: {
              align:'left',
              size: 10, // Set the font size of the legend
              weight: 'bold', // Bold font style
            },
            // Customize legend to show counts along with names
            generateLabels: function(chart) {
              const originalLabels = Chart.overrides.pie.plugins.legend.labels.generateLabels(chart);
              return originalLabels.map(label => {
                const departmentName = label.text;
                const count = departmentData[departmentName] || 0;
                label.text = `${departmentName}: ${count}`; // Append count to legend label
                return label;
              });
            }
          },
        },
       
        datalabels: {
          // Enable labels on each segment
          display: true,
          color: '#fff', // White text color for better contrast
          formatter: function(value, context) {
            return value; // Display the count directly on the segment
          },
          font: {
            weight: 'bold', // Make the label bold
            size: 10, // Adjust the font size
          },
          align: 'center', // Center the label within the segment
          anchor: 'center', // Ensure the label is anchored at the center of the segment
        },
      },
 
      maintainAspectRatio: false
    }
  });
}
 
// bargraph
// function createBarChart(departmentTenderAmounts) {
 
//   // Get department names and their corresponding tender amounts
//   const departmentNames = Object.keys(departmentTenderAmounts);
//   const tenderAmounts = Object.values(departmentTenderAmounts);
 
//   // Combine the department names and tender amounts into an array of objects
//   const departmentsWithAmounts = departmentNames.map((name, index) => ({
//     name: name,
//     amount: tenderAmounts[index]
//   }));
 
//   // Sort the array by tender amount in descending order
//   departmentsWithAmounts.sort((a, b) => b.amount - a.amount);
 
//   // Extract sorted department names and tender amounts
//   const sortedDepartmentNames = departmentsWithAmounts.map(dept => dept.name);
//   const sortedTenderAmounts = departmentsWithAmounts.map(dept => dept.amount);
 
//   // Get the canvas element
//   var ctx = document.getElementById('barGraphChart').getContext('2d');
 
//   // Create a new bar chart
//   new Chart(ctx, {
//     type: 'bar',
//     data: {
//       labels: sortedDepartmentNames,
//       datasets: [{
//         label: 'Total Tender Amount',
//         data: sortedTenderAmounts,
//         backgroundColor: sortedDepartmentNames.map(name => departmentColors[name] || '#ccc'), // Map department colors
//       }],
//     },
//     options: {
//       responsive: true,
//       scales: {
//         y: {
//           beginAtZero: true, // Ensure y-axis starts at 0
//           title: {
//             display: true,
//             text: 'Tender Amount (in currency)', // Customize based on the currency unit
//           },
//         },
//         x: {
//           title: {
//             display: true,
//             text: 'Departments',
//           },
//         }
//       },
//       plugins: {
//         legend: {
//           display: true,
//           position: 'bottom',
//         },
//       },
//       maintainAspectRatio: false,
//     }
//   });
// }
 
function createBarChart(departmentTenderAmounts) {

  // Get department names and their corresponding tender amounts
  const departmentNames = Object.keys(departmentTenderAmounts);
  const tenderAmounts = Object.values(departmentTenderAmounts);

  // Combine the department names and tender amounts into an array of objects
  const departmentsWithAmounts = departmentNames.map((name, index) => ({
    name: name,
    amount: tenderAmounts[index]
  }));

  // Sort the array by tender amount in descending order
  departmentsWithAmounts.sort((a, b) => b.amount - a.amount);

  // Extract sorted department names and tender amounts
  const sortedDepartmentNames = departmentsWithAmounts.map(dept => dept.name);
  const sortedTenderAmounts = departmentsWithAmounts.map(dept => dept.amount);

  // Get the canvas element
  var ctx = document.getElementById('barGraphChart').getContext('2d');

  // Create a new bar chart with horizontal orientation
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sortedDepartmentNames,
      datasets: [{
        label: 'Total Tender Amount',
        data: sortedTenderAmounts,
        backgroundColor: sortedDepartmentNames.map(name => departmentColors[name] || '#ccc'), // Map department colors
      }],
    },
    options: {
      indexAxis: 'y',  // This makes the bars horizontal
      responsive: true,
      scales: {
        x: {
          beginAtZero: true, // Ensure x-axis (tender amounts) starts at 0
          title: {
            display: true,
            text: 'Tender Amount (in currency)', // Customize based on the currency unit
          },
          ticks: {
            stepSize: 100000, // Set interval to 100,000
            callback: function(value) {
              return value.toLocaleString(); // Add commas as thousand separators
            }
          }
        },
        y: {
          title: {
            display: true,
            text: 'Departments',
          },
        }
      },
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
        },
      },
      maintainAspectRatio: false,
    }
  });
}

 

// -------------------------
$(document).ready(function () {
  // Handle click event on minimize-button
  $('#minimize-button').click(function () {
    // Hide the pagination div
    $('#pagination').hide();
  });
});

// for search button

document.addEventListener('DOMContentLoaded', (event) => {
  // var columns = {"Work_ID":"Work ID", "Budget_Code":"Budget Code", "Name_of_Work":"Name of Work", "Scope_of_Work":"Scope of Work", "Name_of_JE":"Name of JE", "Agency":"Agency"};
  var columns = { "PID": "PID", "Work_ID": "Work ID", "Budget_Code": "Budget Code", "Name_of_Work": "Name of Work", "Scope_of_Work": "Scope of Work", "Name_of_JE": "Name of JE", "Agency": "Agency" };

  var select = document.getElementById("search_type");

  // Populate dropdown with column names
  for (var key in columns) {
    if (columns.hasOwnProperty(key)) {
      var option = document.createElement("option");
      option.text = columns[key];
      option.value = key;
      select.appendChild(option);

    }
  }
  // Initialize selected value variable
  let selectedValue;
  // Event listener for dropdown change
  $("#search_type").change(function () {
    var selectedValue = $(this).val();
    var selectedText = columns[selectedValue]; // Get corresponding label from columns object
    var input = document.getElementById("searchInputDashboard");
    // Update input placeholder and clear input value
    var selectedValue = select.value;
    input.placeholder = "Search " + selectedText;
    input.value = "";
    // Call autocomplete with empty array and selected column
    autocomplete(input, [], selectedValue);

    // Trigger search based on the selected column immediately after selecting
    if (selectedValue) {
      getValues(function (data) {
        autocomplete(input, data, selectedValue); // Call autocomplete with fetched data and selected column
      });
    }

    function getValues(callback) {
      var geoServerURL = `${main_url}pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=IWMS_line,IWMS_point,IWMS_polygon,GIS_Ward_Layer&propertyName=${selectedValue}&outputFormat=application/json`;
      // console.log(geoServerURL, "geoServerURLsearch");

      $.getJSON(geoServerURL, function (data) {
        var workTypeSet = new Set();

        // Populate the Set with work types
        $.each(data.features, function (index, feature) {
          var workType = feature.properties[selectedValue];

          // Convert number (double) values to strings
          if (typeof workType === 'number') {
            workType = workType.toString();
          }
          if (workType !== null) {
            workTypeSet.add(workType);
          }
        });

        // Convert the Set to an array
        var uniqueWorkTypes = Array.from(workTypeSet);
        // console.log(uniqueWorkTypes, "uniqueWorkTypes");

        // Call the callback function with the uniqueWorkTypes array
        callback(uniqueWorkTypes);
      });
    }

    // Call getValues function and initialize autocomplete
    getValues(function (data) {
      // console.log("heheheh", data);
      console.log(selectedValue, "LLLLLLLLLLLLLLLLLLLLLL")
      // Initialize autocomplete with fetched data
      autocomplete(document.getElementById("searchInputDashboard"), data);
    });
  });

  // autocomplete function
  async function autocomplete(input, arr, selectedColumn) {
    let currentFocus;
    input.addEventListener("input", function () {
      let list, item, i, val = this.value.toLowerCase(); // Convert input value to lowercase for case-insensitive comparison
      closeAllLists();
      if (!val) return false;
      currentFocus = -1;
      list = document.createElement("ul");
      list.setAttribute("id", "autocomplete-list");
      list.setAttribute("class", "autocomplete-items");
      document.getElementById("autocompleteSuggestions").appendChild(list);
      for (i = 0; i < arr.length; i++) {
        if (arr[i].toLowerCase().includes(val)) { // Check if the suggestion contains the input value
          item = document.createElement("li");
          item.innerHTML = arr[i].replace(new RegExp(val, 'gi'), (match) => `<strong>${match}</strong>`); // Highlight matching letters
          item.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
          item.addEventListener("click", function () {
            selectedValue = this.getElementsByTagName("input")[0].value; // Store the selected value


            var searchtypefield = $("#search_type").val();
            // console.log(searchtypefield, "ppppppppppppppppp99999999")
            let cqlFilter;

            cqlFilter = `${searchtypefield} IN ('${selectedValue}')`;
            IWMS_point.setParams({
              CQL_FILTER: cqlFilter,
              maxZoom: 19.5,
              styles: "IWMS_points"
            });

            IWMS_line.setParams({
              CQL_FILTER: cqlFilter,
              maxZoom: 19.5,
              styles: "IWMS_line"
            });

            IWMS_polygon.setParams({
              CQL_FILTER: cqlFilter,
              maxZoom: 19.5,
              styles: "IWMS_polygon"
            });
            GIS_Ward_Layer.setParams({
              CQL_FILTER: cqlFilter,
              maxZoom: 19.5,
              styles: "IWMS_polygon"
            }).addTo(map);

            console.log("Adding IWMS_point, IWMS_line, and IWMS_polygon layers with filter:", cqlFilter);
            IWMS_point.addTo(map).bringToFront();
            IWMS_line.addTo(map).bringToFront();
            IWMS_polygon.addTo(map).bringToFront();
            GIS_Ward_Layer.addTo(map).bringToFront();
            fitbous(cqlFilter);

            DataTableFilter(cqlFilter)
            input.value = selectedValue;
            closeAllLists();
          });
          list.appendChild(item);
        }
      }
    });

    input.addEventListener("keydown", function (e) {
      let x = document.getElementById("autocomplete-list");
      if (x) x = x.getElementsByTagName("li");
      if (e.keyCode === 40) {
        currentFocus++;
        addActive(x);
      } else if (e.keyCode === 38) { //up
        currentFocus--;
        addActive(x);
      } else if (e.keyCode === 13) {
        e.preventDefault();
        if (currentFocus > -1) {
          if (x) {
            selectedValue = x[currentFocus].getElementsByTagName("input")[0].value; // Store the selected value
            input.value = selectedValue;
            closeAllLists();
          }
        }
      }
    });

    function addActive(x) {
      if (!x) return false;
      removeActive(x);
      if (currentFocus >= x.length) currentFocus = 0;
      if (currentFocus < 0) currentFocus = (x.length - 1);
      x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
      for (let i = 0; i < x.length; i++) {
        x[i].classList.remove("autocomplete-active");
      }
    }

    function closeAllLists(elmnt) {
      let x = document.getElementsByClassName("autocomplete-items");
      for (let i = 0; i < x.length; i++) {
        if (elmnt !== x[i] && elmnt !== input) {
          x[i].parentNode.removeChild(x[i]);
        }
      }
    }

    document.addEventListener("click", function (e) {
      closeAllLists(e.target);
    });
  }
});

const layerDetails = {
  "pmc:IWMS_point": ["PID", "Work_ID", "Name_of_Work", "project_fi", "Department ", "Work_Type", "Project_Office", "zone", "ward", "Tender_Amount", "Name_of_JE", "Contact_Number", "GIS_Created_At"],
  "pmc:IWMS_line": ["PID", "Work_ID", "Name_of_Work", "project_fi", "Department", "Work_Type", "Project_Office", "zone", "ward", "Tender_Amount", "Name_of_JE", "Contact_Number", "GIS_Created_At"],
  "pmc:IWMS_polygon": ["PID", "Work_ID", "Name_of_Work", "project_fi", "Department", "Work_Type", "Project_Office", "zone", "ward", "Tender_Amount", "Name_of_JE", "Contact_Number", "GIS_Created_At"],
};

const labelMapping = {
  "PID": "Project ID",
  "Work_ID": "Estimate ID",
  "Name_of_Work": "Name of Work",
  "project_fi": "Project Financial Year",
  "Department": "Department Name",
  "Work_Type": "Work Type",
  "Project_Office": "Office Type",
  "zone": "Zone Name",
  "ward": "Ward Name",
  "Tender_Amount": "Tender Amount",
  "Name_of_JE": "Name of JE",
  "Contact_Number": "Contact Number",
  "GIS_Created_At": "Created Date"
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
  if (filterString !== null && filterString !== undefined && filterString !== '') {
    return `${cql_filter123} AND ${filterString}`;
  } else {
    return cql_filter123;
  }
}

// popupshow
map.on("contextmenu", async (e) => {
  let bbox = map.getBounds().toBBoxString();
  let size = map.getSize();

  let daterangeValue = $('#daterange').val();
  let dates = daterangeValue.split(' - ');
  let startDate = moment(dates[0], 'MMMM D, YYYY').format('YYYY-MM-DD');
  let endDate = moment(dates[1], 'MMMM D, YYYY').format('YYYY-MM-DD');

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
      let qrData = "";
      let workID = htmldata["Work_ID"]; // Extract Work_ID
      let PIDID = htmldata["PID"]; // Extract Work_ID
      console.log(PIDID, "OOOOOOOOOOOOOOOOO")

      const dd = await fetchImageUrls(PIDID)
      console.log(dd, "llllllllllllllllll")

      for (let key of selectedKeys) {
        if (htmldata.hasOwnProperty(key)) {
          let value = htmldata[key];
          let label = labelMapping[key] || key; // Use the mapping or the original key if not found
          txtk1 += "<tr><td style='font-weight:bold;'>" + label + "</td><td>" + value + "</td></tr>";
        }
      }

      // Generate the URL with Work_ID for both localhost and production
      // let qrURL = `https://iwmsgis.pmc.gov.in/gis/iwms/login/login.php?work_id=${workID}`;

      let qrURL = `http://localhost/PMC_new/IWMS/IWMS/login/login.php?work_id=${workID}`;
      qrData = qrURL;

      let detaildata1 = `
          <div style='max-height: 350px; height:auto; display: flex; flex-direction: column; gap: 10px;'>
              <div style='display: flex; justify-content: space-between;'>
                  <button id="generateQR" style="background-color: #20B2AA; color: white; border: none; border-radius: 8px; padding: 5px 10px;">
                      Generate QR Code
                      <i class="fas fa-qrcode" style="margin-right: 5px;"></i>
                  </button>
              </div>
              <table style='width:100%; border-collapse: collapse;' class='popup-table'>
                  ${txtk1}
                  <tr><td style='font-weight:bold;'>Co-Ordinates</td><td>${e.latlng}</td></tr>
              </table>
          </div>
      `;
      if (PIDID) {
        const popup = L.popup().setLatLng(e.latlng).setContent(detaildata1).openOn(map);



        // Generate QR code when the button is clicked
        document.getElementById('generateQR').addEventListener('click', () => {
          let qrPopupContent = `
            <div style='max-height: 350px; height:auto; display: flex; flex-direction: column; align-items: center; gap: 10px;'>
                <div id="qrcode"></div>
                <button id="downloadQR" style="background-color: #20B2AA; color: white; border: none; border-radius: 8px; padding: 5px 10px;">
                    Download QR Code
                    <i class="fas fa-download" style="margin-right: 5px;"></i>
                </button>
                <button id="shareQR" style="background-color: #25D366; color: white; border: none; border-radius: 8px; padding: 5px 10px; margin-top: 1px;">
              Share on WhatsApp
              <i class="fas fa-share-alt" style="margin-left: 5px;"></i>
              </button>

            </div>
        `;

          // Open a new popup for the QR code
          let qrPopup = L.popup().setLatLng(e.latlng).setContent(qrPopupContent).openOn(map);

          // Generate the QR code
          let qrcode = new QRCode(document.getElementById('qrcode'), {
            text: qrData,
            width: 128,
            height: 128,
          });

          // Add click event for downloading the QR code
          document.getElementById('downloadQR').addEventListener('click', () => {
            let qrCanvas = document.getElementById('qrcode').querySelector('canvas');
            if (qrCanvas) {
              let qrImage = qrCanvas.toDataURL("image/png");
              let a = document.createElement('a');
              a.href = qrImage;
              a.download = `QRCode_WorkID_${workID}.png`;
              a.click();
            }
          });

          // Share QR code image on WhatsApp when the share button is clicked
          document.getElementById('shareQR').addEventListener('click', () => {
            let qrCanvas = document.getElementById('qrcode').querySelector('canvas');
            if (qrCanvas) {
              let qrImage = qrCanvas.toDataURL("image/png");
              let whatsappURL = `https://wa.me/?text=${encodeURIComponent(qrURL)}&media=${encodeURIComponent(qrImage)}`;
              window.open(whatsappURL, '_blank');
            }
          });
        });

      } else {
        alert("Project not estimated yet")
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }
});







// Function to get image URLs and categories as a dictionary
async function fetchImageUrls(passingPid) {
  try {
    // API endpoint
    const apiUrl = `http://iwms.punecorporation.org/api/uploaded-img?stage=ts_details&tsId=${passingPid}&ra=0&userId=11`;

    // Fetching data
    const response = await fetch(apiUrl, {
      method: 'POST'
    });

    // Convert to JSON
    const data = await response.json();

    // Check if status is true
    if (data.status) {
      const images = data.data;

      // Creating a dictionary of image URLs and categories
      const imageDetails = {};

      images.forEach((image) => {
        imageDetails[image.f_id] = {
          image_url: image.image_url,   // Storing the image URL
          category: image.category      // Storing the category
        };
      });

      // Returning the dictionary of image details
      return imageDetails;
    } else {
      console.error('No images found');
      return {};
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return {};
  }
}

// // Example of calling the function
// fetchImageUrls(20795).then(imageDetails => {
//   console.log(imageDetails);  // Output the dictionary of image details
// });










// -------------------------------------------
// // geotag

// map.on("click", async (e) => {
//   let bbox = map.getBounds().toBBoxString();
//   let size = map.getSize();

//   // Define the workspaces and their respective layer details
//   const workspaceLayers = {
//     'PMC_test': {
//       "PMC_test:geotagphoto": ['photo', 'category', 'createdAt', 'works_aa_approval_id', 'timestamp', 'imagepath', 'distance_calc'],
//     },
//     'pmc': {
//       "pmc:output_data": ['proj_id', 'category', 'file', 'verify_role_id', 'image_url', 'Name_of_Work'],
//     }
//   };

//   let detailsArray = [];

//   for (let workspace in workspaceLayers) {
//     for (let layer in workspaceLayers[workspace]) {
//       let selectedKeys = workspaceLayers[workspace][layer];
//       let urrr = `${main_url}${workspace}/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${layer}&STYLES&LAYERS=${layer}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(e.containerPoint.x)}&Y=${Math.round(e.containerPoint.y)}&SRS=EPSG%3A4326&WIDTH=${size.x}&HEIGHT=${size.y}&BBOX=${bbox}`;

//       try {
//         let response = await fetch(urrr);
//         let html = await response.json();
//         let features = html.features;

//         for (let feature of features) {
//           let htmldata = feature.properties;
//           let txtk1 = "";
//           let imageUrl = "";
//           let pdfUrl = "";
//           let Is_Panoromic = false;  // Flag to track panoramic images
//           let category = htmldata['category'] || 'N/A';  // Get the category

//           for (let key of selectedKeys) {
//             if (htmldata.hasOwnProperty(key)) {
//               let value = htmldata[key];

//               if (key === "imagepath") {
//                 let imagename = htmldata["photo"];
//                 imageUrl = `${value}${imagename}`;
//               } else if (key === "image_url") {
//                 if (value.toLowerCase().endsWith(".png") || value.toLowerCase().endsWith(".jpeg") || value.toLowerCase().endsWith(".jpg")) {
//                   imageUrl = value;
//                 } else if (value.toLowerCase().endsWith(".pdf")) {
//                   pdfUrl = value;
//                 }
//               }

//               // Add the data to the HTML
//               txtk1 += `<tr><td style="background-color: #9393d633; width:30px;">${key}</td><td>${value}</td></tr>`;
//             }
//           }

//           // Get the image dimensions to determine if it's panoramic
//           if (imageUrl) {
//             try {
//               let dimensions = await getImageDimensions(imageUrl);
//               if (dimensions.ratio > 2) {
//                 Is_Panoromic = true;  // Set the flag if the ratio is greater than 2
//               }
//             } catch (err) {
//               console.error("Error fetching image dimensions:", err);
//             }
//           }

//           // Add to details array
//           detailsArray.push({
//             index: detailsArray.length + 1,
//             category: category,
//             txtk1: txtk1,
//             imageUrl: imageUrl,
//             pdfUrl: pdfUrl,
//             Is_Panoromic: Is_Panoromic
//           });
//         }
//       } catch (error) {
//         console.error(`Error fetching data for layer ${layer} in workspace ${workspace}:`, error);
//       }
//     }
//   }

//   if (detailsArray.length > 0) {
//     let currentIndex = 0;

//     function updatePopup() {
//       let imageElement = document.getElementById('popupImage');
//       let pdfElement = document.getElementById('popupPdf');
//       let panoElement = document.getElementById('panoramaViewer');  // Panoramic viewer container
//       let tableBodyElement = document.getElementById('popupTableBody');
//       let featureTitleElement = document.getElementById('featureTitle');
//       let prevIcon = document.getElementById('prevIcon');
//       let nextIcon = document.getElementById('nextIcon');

//       // Clear existing Pannellum viewer to prevent multiple instances
//       if (window.panoViewer) {
//         window.panoViewer.destroy();
//         window.panoViewer = null;
//       }

//       if (detailsArray[currentIndex].Is_Panoromic) {
//         panoElement.style.display = 'block';
//         imageElement.style.display = 'none';
//         pdfElement.style.display = 'none';

//         // Initialize Pannellum viewer
//         window.panoViewer = pannellum.viewer('panoramaViewer', {
//           type: 'equirectangular',
//           panorama: detailsArray[currentIndex].imageUrl,
//           autoLoad: true,
//           autoRotate: 0,
//           showFullscreenCtrl: false
//         });
//       } else if (detailsArray[currentIndex].imageUrl) {
//         imageElement.src = detailsArray[currentIndex].imageUrl;
//         imageElement.style.display = 'block';
//         panoElement.style.display = 'none';
//         pdfElement.style.display = 'none';
//       } else if (detailsArray[currentIndex].pdfUrl) {
//         pdfElement.src = detailsArray[currentIndex].pdfUrl;
//         pdfElement.style.display = 'block';
//         panoElement.style.display = 'none';
//         imageElement.style.display = 'none';
//       }

//       tableBodyElement.innerHTML = detailsArray[currentIndex].txtk1;
//       featureTitleElement.textContent = `Feature ${detailsArray[currentIndex].index} - ${detailsArray[currentIndex].category}`;

//       prevIcon.disabled = currentIndex === 0;
//       nextIcon.disabled = currentIndex === detailsArray.length - 1;
//     }

//     let detaildata = `<div id="popup-content" style='max-height: 350px; max-width: 270px; position: relative;'>
//       <button id='prevIcon' class='pagination-icon' style='left: 10px;' disabled>
//         <i class='fas fa-chevron-left'></i>
//       </button>
//       <h6 id="featureTitle">Feature 1 - ${detailsArray[0].category}</h6>

//       <!-- Container for Panoramic Viewer -->
//       <div id="panoramaViewer" style="width: 100%; height: 200px; display: ${detailsArray[0].Is_Panoromic ? 'block' : 'none'};"></div>

//       <!-- Image Element for Normal Images -->
//       <img id="popupImage" src="${detailsArray[0].imageUrl}" alt="Image" style="width: 100%; height: auto; display: ${detailsArray[0].imageUrl && !detailsArray[0].Is_Panoromic ? 'block' : 'none'};">

//       <!-- Iframe for PDF Display -->
//       <iframe id="popupPdf" src="${detailsArray[0].pdfUrl}" style="width: 100%; height: 200px; display: ${detailsArray[0].pdfUrl ? 'block' : 'none'};"></iframe>

//       <button id='nextIcon' class='pagination-icon' style='right: 10px;' ${detailsArray.length > 1 ? '' : 'disabled'}>
//         <i class='fas fa-chevron-right'></i>
//       </button>
//       <table class='popuptable'>
//         <tbody id="popupTableBody">
//           ${detailsArray[0].txtk1}
//         </tbody>
//       </table>
//     </div>`;

//     // Set the popup content and open it
//     L.popup().setLatLng(e.latlng).setContent(detaildata).openOn(map);

//     // After the popup is added to the DOM, initialize the popup content
//     updatePopup();

//     // Event listeners for navigation buttons
//     document.getElementById('prevIcon').addEventListener('click', () => {
//       if (currentIndex > 0) {
//         currentIndex--;
//         updatePopup();
//       }
//     });

//     document.getElementById('nextIcon').addEventListener('click', () => {
//       if (currentIndex < detailsArray.length - 1) {
//         currentIndex++;
//         updatePopup();
//       }
//     });
//   } else {
//     console.log("No features found");
//   }
// });

// // Helper function to get image dimensions
// function getImageDimensions(url) {
//   return new Promise((resolve, reject) => {
//     const img = new Image();
//     img.src = url;

//     img.onload = function () {
//       const width = img.width;
//       const height = img.height;
//       const ratio = width / height;
//       resolve({ width, height, ratio });
//     };

//     img.onerror = function () {
//       reject(`Error loading image at ${url}`);
//     };
//   });
// }

// update code filter with geotag


// geotag
// Ensure you have the getCheckedValuesforpopuups and combineFilters functions defined as in your original code.

// Modified map.on("click") handler to include filters


map.on("click", async (e) => {
  let bbox = map.getBounds().toBBoxString();
  let size = map.getSize();

  // Retrieve the current filter string based on selected checkboxes
  let filterString = await getCheckedValuesforpopuups();

  // Additionally, retrieve date range filters if applicable
  let daterangeValue = $('#daterange').val();
  let dates = daterangeValue.split(' - ');
  let startDate = moment(dates[0], 'MMMM D, YYYY').format('YYYY-MM-DD');
  let endDate = moment(dates[1], 'MMMM D, YYYY').format('YYYY-MM-DD');

  // Retrieve any search filters if applicable
  var searchtypefield = $("#search_type").val();
  var searchtypefield1 = $("#searchInputDashboard").val();

  let cqlFilter = "";

  if (searchtypefield1) {
    cqlFilter = `${searchtypefield} IN ('${searchtypefield1}')`;
  } else {
    cqlFilter = `conc_appr_ >= '${startDate}' AND conc_appr_ < '${endDate}'`;

    if (filterString.trim() !== "") {
      cqlFilter = combineFilters(cqlFilter, filterString);
    }
  }

  console.log("Combined CQL Filter:", cqlFilter);

  // Define the workspaces and their respective layer details
  const workspaceLayers1 = {
    "pmc:IWMS_point": ["PID", "Name_of_Work","Tender_Amount", "Name_of_JE"],
    "pmc:IWMS_line": ["PID","Name_of_Work","Tender_Amount", "Name_of_JE"],
    "pmc:IWMS_polygon": ["PID","Name_of_Work","Tender_Amount", "Name_of_JE"],
  }


  let detailsArray = [];

  for (let workspace in workspaceLayers1) {
    for (let layer in workspaceLayers1[workspace]) {
      let selectedKeys = workspaceLayers1[workspace][layer];

      let urrr = `${main_url}pmc/wms?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=${workspace}&STYLES&LAYERS=${workspace}&exceptions=application%2Fvnd.ogc.se_inimage&INFO_FORMAT=application/json&FEATURE_COUNT=50&X=${Math.round(e.containerPoint.x)}&Y=${Math.round(e.containerPoint.y)}&SRS=EPSG%3A4326&WIDTH=${size.x}&HEIGHT=${size.y}&BBOX=${bbox}&CQL_FILTER=${encodeURIComponent(cqlFilter)}`;

      try {
        let response = await fetch(urrr);
        let html = await response.json();
        let features = html.features

        for (let feature of features) {
          let htmldata = feature.properties;
          let imageUrl = "";
          let pdfUrl = "";
          let Is_Panoromic = false;  // Flag to track panoramic images
          let category1 = ""; // Get the category
          const pidfromlayers = htmldata['PID'] || 'N/A';
          const NameofWork  = htmldata['Name_of_Work'] || 'N/A';
          const Tenstedramount  = htmldata['Tender_Amount'] || 'N/A';
          const  JEName = htmldata['Name_of_JE'] || 'N/A';



          const imageDetails = await fetchImageUrls(pidfromlayers)



          for (const fId in imageDetails) {
            let txtk1 = "";
            if (imageDetails.hasOwnProperty(fId)) {
              const { image_url, category } = imageDetails[fId];
              // alert(image_url, category)
              category1 = category;
              if (image_url) {
                if (image_url.toLowerCase().endsWith(".png") || image_url.toLowerCase().endsWith(".jpeg") || image_url.toLowerCase().endsWith(".jpg")) {
                  imageUrl = image_url; // Store image URL
                }
                else if (image_url.toLowerCase().endsWith(".pdf")) {
                  pdfUrl = image_url; // Store PDF URL
                }
              }
              txtk1 += `<tr><td style="background-color: #9393d633; width:30px;"> Project ID </td><td>${pidfromlayers}</td></tr>
              <tr><td style="background-color: #9393d633; width:30px;"> Name of Work </td><td>${NameofWork}</td></tr>
              <tr><td style="background-color: #9393d633; width:30px;"> Je Name </td><td>${JEName}</td></tr>
              <tr><td style="background-color: #9393d633; width:30px;"> Tender Amount </td><td>${Tenstedramount}</td></tr>`;
            }
            if (imageUrl) {
              try {
                let dimensions = await getImageDimensions(imageUrl);
                if (dimensions.ratio > 2) {
                  Is_Panoromic = true;  // Set the flag if the ratio is greater than 2
                }
              } catch (err) {
                console.error("Error fetching image dimensions:", err);
              }
            }

            // Add to details array
            detailsArray.push({
              index: detailsArray.length + 1,
              category: category1,
              txtk1: txtk1,
              imageUrl: imageUrl,
              pdfUrl: pdfUrl,
              Is_Panoromic: Is_Panoromic
            });
          }
        }
      } catch (error) {
        console.error(`Error fetching data for layer ${layer} in workspace ${workspace}:`, error);
      }
    }
  }

  if (detailsArray.length > 0) {
    let currentIndex = 0;

    function updatePopup() {
      let imageElement = document.getElementById('popupImage');
      let pdfElement = document.getElementById('popupPdf');
      let panoElement = document.getElementById('panoramaViewer');  // Panoramic viewer container
      let tableBodyElement = document.getElementById('popupTableBody');
      let featureTitleElement = document.getElementById('featureTitle');
      let prevIcon = document.getElementById('prevIcon');
      let nextIcon = document.getElementById('nextIcon');

      // Clear existing Pannellum viewer to prevent multiple instances
      if (window.panoViewer) {
        window.panoViewer.destroy();
        window.panoViewer = null;
      }

      if (detailsArray[currentIndex].Is_Panoromic) {
        panoElement.style.display = 'block';
        imageElement.style.display = 'none';
        pdfElement.style.display = 'none';

        // Initialize Pannellum viewer
        window.panoViewer = pannellum.viewer('panoramaViewer', {
          type: 'equirectangular',
          panorama: detailsArray[currentIndex].imageUrl,
          autoLoad: true,
          autoRotate: 0,
          showFullscreenCtrl: false
        });
      } else if (detailsArray[currentIndex].imageUrl) {
        imageElement.src = detailsArray[currentIndex].imageUrl;
        imageElement.style.display = 'block';
        panoElement.style.display = 'none';
        pdfElement.style.display = 'none';
      } else if (detailsArray[currentIndex].pdfUrl) {
        pdfElement.src = detailsArray[currentIndex].pdfUrl;
        pdfElement.style.display = 'block';
        panoElement.style.display = 'none';
        imageElement.style.display = 'none';
      }

      tableBodyElement.innerHTML = detailsArray[currentIndex].txtk1;
      featureTitleElement.textContent = `Feature ${detailsArray[currentIndex].index} - ${detailsArray[currentIndex].category}`;

      prevIcon.disabled = currentIndex === 0;
      nextIcon.disabled = currentIndex === detailsArray.length - 1;
    }

    let detaildata = `<div id="popup-content" style='max-height: 350px; max-width: 270px; position: relative;'>
      <button id='prevIcon' class='pagination-icon' style='left: 10px;' disabled>
        <i class='fas fa-chevron-left'></i>
      </button>
      <h6 id="featureTitle">Feature 1 - ${detailsArray[0].category}</h6>
      
      <!-- Container for Panoramic Viewer -->
      <div id="panoramaViewer" style="width: 100%; height: 200px; display: ${detailsArray[0].Is_Panoromic ? 'block' : 'none'};"></div>
      
      <!-- Image Element for Normal Images -->
      <img id="popupImage" src="${detailsArray[0].imageUrl}" alt="Image" style="width: 100%; height: auto; display: ${detailsArray[0].imageUrl && !detailsArray[0].Is_Panoromic ? 'block' : 'none'};">
      
      <!-- Iframe for PDF Display -->
      <iframe id="popupPdf" src="${detailsArray[0].pdfUrl}" style="width: 100%; height: 200px; display: ${detailsArray[0].pdfUrl ? 'block' : 'none'};"></iframe>
      
      <button id='nextIcon' class='pagination-icon' style='right: 10px;' ${detailsArray.length > 1 ? '' : 'disabled'}>
        <i class='fas fa-chevron-right'></i>
      </button>
      <table class='popuptable'>
        <tbody id="popupTableBody">
          ${detailsArray[0].txtk1}
        </tbody>
      </table>
    </div>`;

    // Set the popup content and open it
    L.popup().setLatLng(e.latlng).setContent(detaildata).openOn(map);

    // After the popup is added to the DOM, initialize the popup content
    updatePopup();

    // Event listeners for navigation buttons
    document.getElementById('prevIcon').addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updatePopup();
      }
    });

    document.getElementById('nextIcon').addEventListener('click', () => {
      if (currentIndex < detailsArray.length - 1) {
        currentIndex++;
        updatePopup();
      }
    });
  } else {
    console.log("No geotag photos found matching the current filters.");
    // Optionally, display a popup informing the user that no features were found
    L.popup()
      .setLatLng(e.latlng)
      .setContent("<p>No geotag photos found matching the current filters.</p>")
      .openOn(map);
  }
});

// Ensure that your main_url variable is correctly defined and accessible within this scope.
// Also, ensure that your CQL_FILTER syntax matches the requirements of your WMS service.

// Optional: Debounce the getCheckedValuesforpopuups if the filters are updated frequently to optimize performance.

// Example of debouncing (optional)
function debounce(func, wait) {
  let timeout;
  return function (...args) {
    const later = () => {
      clearTimeout(timeout);
      func.apply(this, args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// If you need to debounce filter updates, you can wrap getCheckedValuesforpopuups
const debouncedGetCheckedValuesforpopuups = debounce(getCheckedValuesforpopuups, 300);

// Then use debouncedGetCheckedValuesforpopuups instead of getCheckedValuesforpopuups if necessary
