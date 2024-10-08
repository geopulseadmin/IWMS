var main_url = "https://iwmsgis.pmc.gov.in/geoserver/"

// html page code ......................


function toggleFilter(label) {
  const input = label.nextElementSibling; // Get the input element next to the label
  const ul = input.nextElementSibling; // Get the ul element next to the input

  // Toggle 'active' class for the clicked filter input and its associated ul
  input.classList.toggle('active');
  ul.classList.toggle('active');
}

// Function to close filter groups when clicking outside
document.addEventListener('click', function(event) {
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


// });

// toggleFilterend---------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  const filters = document.getElementById('filters');
  const map = document.getElementById('map');
  const tableBtn = document.getElementById('openTableBtn');
  const tableinfo = document.getElementById('tablecontainer');
  const button = document.getElementById('toggleFilters');
 
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



$(document).ready(function () {
  // search()

  var start = moment().subtract(29, 'days');
  var end = moment();
  var cql_filter1; // Declare the variable in the outer scope

  $('#daterange').daterangepicker({
    opens: 'left',
    locale: {
      format: 'MMMM D, YYYY' // Format to show Month name, Day, and Year
    },
    startDate: start,
    endDate: end,
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

  function cb(start, end) {
    $('#daterange').val(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
    var formattedStartDate = start.format('M/D/YY, h:mm A');;
    var formattedEndDate = end.format('M/D/YY, h:mm A');;
    cql_filter1 = `conc_appr_ >= '${formattedStartDate}' AND conc_appr_ < '${formattedEndDate}'`;
    console.log(cql_filter1, "lll")

    DataTableFilter(cql_filter1)


    loadinitialData(cql_filter1);
    // const cql_filter = getCqlFilter();
    getCheckedValues(function (filterString) {


      const mainfilter = combineFilters(cql_filter1, filterString);
      console.log("Main Filterfor checking:", mainfilter);


      FilterAndZoom(mainfilter);
      DataTableFilter(mainfilter)

    })

  }
  // Function to get cql_filter1 value
  function getCqlFilter() {
    return cql_filter1;
  }

  function loadinitialData(cql_filter) {
    const filternames = ["Project_Office", "project_fi", "zone", "ward", "Department", "stage", "Work_Type"]; //accordn column names , if want add one more filter criteria add here

    filternames.forEach(function (filtername) {
      var url = `${main_url}pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=IWMS_line,IWMS_point,IWMS_polygon&propertyName=${filtername}&outputFormat=application/json&cql_filter=${encodeURIComponent(cql_filter)}`;
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
        var uniqueProjectFiList = Array.from(projectFiMap.entries()).map(([name, count]) => `${name} (${count})`);
        populateDropdown(filtername, uniqueProjectFiList);
      });
    });

    FilterAndZoom(cql_filter)
  }

  function combineFilters(cql_filter, filterString) {
    return `(${cql_filter}) AND (${filterString})`;
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

        DataTableFilter(mainfilter)

      });
    });
  }

  initialize();


});



function DataTableFilter(cql_filter1) {
  var layers = ["pmc:IWMS_line", "pmc:IWMS_point", "pmc:IWMS_polygon"];
  var typeName = layers.join(',');
  var cqlFilter = cql_filter1;
  var geoServerURL =
    `${main_url}pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=${typeName}&outputFormat=application/json&CQL_FILTER=${encodeURIComponent(cqlFilter)}`;
  var headers = ['Work_ID', 'Name_of_Work', 'Department', 'Budget_Code', 'Work_Type', 'Name_of_JE', 'Agency', 'stage', 'Tender_Amount', 'Created_At'];

  showtable(typeName, geoServerURL, cqlFilter, headers);

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
  fitbous(filter)
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
};


function fitbous(filter) {
  var layers = ["pmc:IWMS_point", "pmc:IWMS_line", "pmc:IWMS_polygon"];
  var bounds = null;

  var processLayer = function (layerName, callback) {
    var urlm =
      main_url + "ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
      layerName +
      "&CQL_FILTER=" +
      filter +
      "&outputFormat=application/json";

    $.getJSON(urlm, function (data) {
      var geojson = L.geoJson(data);
      var layerBounds = geojson.getBounds();
      if (bounds) {
        bounds.extend(layerBounds);
      } else {
        bounds = layerBounds;
      }
      callback();
    });
  };

  var layersProcessed = 0;
  layers.forEach(function (layerName) {
    processLayer(layerName, function () {
      layersProcessed++;
      if (layersProcessed === layers.length) {
        // Apply the combined bounds to the map after all layers are processed
        if (bounds) {
          map.fitBounds(bounds);
        }
      }
    });
  });
}






// for dashboard table dynamic



function showtable(typeName, geoServerURL, cqlFilter, headers) {


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
        minimizeButton.style.display='none';
        // minimizeButton.innerText = '+';
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

    // Add 'Serial No' as the first header
    headers.unshift('Sr_no');

    // Create header cells
    headers.forEach(headerText => {
      var th = document.createElement('th');
      th.textContent = headerText;
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

      // Add other data columns
      headers.slice(1).forEach(header => { // Exclude the first header (Serial No)
        if (header !== 'Serial No' && header !== 'geometry') {
          var cell = document.createElement('td');
          cell.textContent = item[header] || ''; // Handle cases where item[header] might be undefined
          row.appendChild(cell);
        }
      });

      // Add click listener to highlight the geometry on the map
      row.addEventListener('click', function () {
        console.log(item);
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
    $(document).ready(function() {
      $('#data-table').DataTable({
        paging: true, // Enable pagination
        lengthChange: true, // Enable the 'Show X entries' dropdown
        searching: true, // Enable search box
        ordering: true, // Enable column sorting
        info: true, // Enable showing 'Showing X of Y entries' info
        autoWidth: false, // Disable auto width calculation
        scrollY: 400, // Enable vertical scrolling within the table
        scrollCollapse: true, 
        fixedHeader: true 
      });
    });
}

// Function to show the hidden table
function showTable() {
    var tableDetail = document.querySelector('.tableDetail');
    var minimizeButton = document.querySelector('.minimize-button');
    tableDetail.style.display = 'block';
    minimizeButton.style.display='block';
    // minimizeButton.innerText = '-';
    document.getElementById('openTableBtn').style.display = 'none'; // Hide the show button
}

// Add event listener to the show table button
document.getElementById('openTableBtn').addEventListener('click', showTable);

  
  // -------------------------------------------------------------
  function tableData(typeName, geoServerURL, cqlFilter, headers) {
    $.getJSON(geoServerURL, function (data) {
      var filteredData = data;
      console.log(filteredData, "ggggggggggggggggggg");
      // filteredData.features.properties.Work_ID
      const work_id =[];
      var exampleData = filteredData.features.map(feature => {
        let mappedData = {};
        headers.forEach(header => {
          // Convert header to camelCase or other naming convention if necessary
          let propertyName = header.replace(/ /g, '');
          mappedData[propertyName] = feature.properties[header];
        });
        mappedData.geometry = feature.geometry; 
        work_id.push(feature.properties.Work_ID)
        // Ensure geometry is included
        return mappedData;
      });
      console.log(work_id.length, "lllllllllllll")
      updateTableStats(`Total Projects: ${work_id.length}`);
      createTable(exampleData, headers);
    });
  }

  
};

$(document).ready(function() {
  // Handle click event on minimize-button
  $('#minimize-button').click(function() {
    // Hide the pagination div
    $('#pagination').hide();
  });
});


// for search button


// document.addEventListener('DOMContentLoaded', (event) => {
  // var columns = ["Work_ID","Budget_Code", "Name_of_Work", "Scope_of_Work", "Name_of_JE","Agency"];
  // var select = document.getElementById("search_type");

  // // Populate dropdown with column names
  // for (var i = 0; i < columns.length; i++) {
  //   var option = document.createElement("option");
  //   option.text = columns[i];
  //   option.value = columns[i];
  //   select.appendChild(option);
  // }

  document.addEventListener('DOMContentLoaded', (event) => {
    var columns = {"Work_ID":"Work ID", "Budget_Code":"Budget Code", "Name_of_Work":"Name of Work", "Scope_of_Work":"Scope of Work", "Name_of_JE":"Name of JE", "Agency":"Agency"};
    var select = document.getElementById("search_type");
   
    // Populate dropdown with column names
   for (var key in columns) {
      if (columns.hasOwnProperty(key)) {
        var option = document.createElement("option");
        option.text = columns[key]; // Use columns[key] to get the column name
        option.value = key; // Use key as the value (e.g., Work_ID, Budget_Code)
        select.appendChild(option);
      }
    }
   
  // Initialize selected value variable
  let selectedValue;

  // Event listener for dropdown change
  $("#search_type").change(function () {
    var selectedValue = $(this).val();

    function getValues(callback) {
      var geoServerURL = `${main_url}pmc/wms?service=WFS&version=1.1.0&request=GetFeature&typeName=IWMS_line,IWMS_point,IWMS_polygon&propertyName=${selectedValue}&outputFormat=application/json`;
      console.log(geoServerURL, "geoServerURLsearch");

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
        console.log(uniqueWorkTypes, "uniqueWorkTypes");

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
  function autocomplete(input, arr) {
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
            console.log(selectedValue, "ppppppppppppppppp")


            var searchtypefield = $("#search_type").val();
            console.log(searchtypefield, "ppppppppppppppppp99999999")
            let cqlFilter;
            
            cqlFilter = `${searchtypefield} IN ('${selectedValue}')`;
           
            console.log(cqlFilter, "cqlFilter")




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

          
            console.log("Adding IWMS_point, IWMS_line, and IWMS_polygon layers with filter:", cqlFilter);
            IWMS_point.addTo(map).bringToFront();
            IWMS_line.addTo(map).bringToFront();
            IWMS_polygon.addTo(map).bringToFront();
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


// // draggable

// const container = document.querySelector("#tablecontainer");
// function onMouseDrag({ movementX, movementY }) {
//     let getContainerStyle = window.getComputedStyle(container);
//     let leftValue = parseInt(getContainerStyle.left);
//     let topValue = parseInt(getContainerStyle.top);
//     container.style.left = `${leftValue + movementX}px`;
//     container.style.top = `${topValue + movementY}px`;
// }
// container.addEventListener("mousedown", () => {
//     container.addEventListener("mousemove", onMouseDrag);
// });
// document.addEventListener("mouseup", () => {
//     container.removeEventListener("mousemove", onMouseDrag);
// });

//Pop-Up show


 
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
 
