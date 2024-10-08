

var map = L.map("map", {
    center: [18.52, 73.89],
    zoom: 8,
    minZoom: 9,
    maxZoom: 16,
    boxZoom: true,
    trackResize: true,
    wheelPxPerZoomLevel: 40,
    zoomAnimation: true,
    dragging: true,
    zoomControl: false,
    scrollWheelZoom: true,
    doubleClickZoom: false,
    touchZoom: false
});

var googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"]
});

var Esri_WorldImagery = L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
    maxZoom: 20
});

var osm = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19
}).addTo(map);
var baseURL = "https://iwmsgis.pmc.gov.in/geoserver/pmc/wms";
// var demoURL ="http://iwmsgis.pmc.gov.in:8080/geoserver1/demo/wms";
var IWMS_line = L.tileLayer.wms(baseURL, {
    layers: "IWMS_line",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1
});

var IWMS_polygon = L.tileLayer.wms(baseURL, {
    layers: "IWMS_polygon",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1
});

var IWMS_point = L.tileLayer.wms(baseURL, {
    layers: "IWMS_point",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1
});

var Ward_layer = L.tileLayer.wms(baseURL, {
    layers: "GIS_Ward_Layer",
    format: "image/png",
    transparent: true,
    tiled: true,
    version: "1.1.0",
    opacity: 1
});

var WMSlayers = {
    "Esri": Esri_WorldImagery,
    "Satellite": googleSat,
    "osm": osm,
    "IWMS_line": IWMS_line,
    "IWMS_polygon": IWMS_polygon,
    "IWMS_point": IWMS_point,
    "Ward_layer": Ward_layer
};

var control = new L.control.layers({}, WMSlayers).addTo(map);
control.setPosition('topright');

var highlightLayer;

const API_URL = "https://iwmsgis.pmc.gov.in/gis/test/";

async function onClickEdit(department, id, Work_ID) {

    const response = await fetch(`https://iwms.punecorporation.org/api/project-gis-data?proj_id=${Work_ID}`);

    //  const response = await fetch('api-responses/all-project-data.json');
    const projectData = await response.json();
    const project = projectData.data;

    const conceptual = await fetch(`${API_URL}APIS/Get_Conceptual_Form_By_Work_Id.php?works_approval_id=${Work_ID}`);
    const resConceptual = await conceptual.json();
    const conceptualData = resConceptual.data;

    if (conceptualData.struct_no > 10) {


        const baseURL = "ward.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }

    if (department == "Road") {


        const baseURL = "road.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }

    else if (department === "Building") {


        const baseURL = "building.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }

    // 4) drainage------------------------------
    else if (department === "Drainage") {


        const baseURL = "drainage.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }
    // 5)water-supply-------------------------
    else if (department === "Water Supply") {


        const baseURL = "water-suppy.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }

    // 6) Electrical---------------------

    else if (department === "Electrical") {


        const baseURL = "electric-work.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }
    // 7) project work-------------------------
    else if (department === "Project Work") {


        const baseURL = "project.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }
    // 8) swm------------------------------
    else if (department === 'Solid waste Management') {


        const baseURL = "solidWasteManagement.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }
    // 9) garden-------------------------
    else if (department === "Garden") {


        const baseURL = "garden.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }

    // 10) garden horticulture----------------------------
    else if (department === "Garden Horticulture") {


        const baseURL = "gardenhoriculture.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }
    // 11) encrochment=----------------------------------------
    else if (department === "Encroachment ") {


        const baseURL = "Encroachment.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }
    // 12) education---------------------------------
    else if (department === "Education Department (Primary)") {


        const baseURL = "Education.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }
    // 13) market--------------------------
    else if (department === "Market") {


        const baseURL = "market.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }

    // 14) Environment----------------------------------
    else if (department === "Environment") {


        const baseURL = "Environtment.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }
    // 15) sport---------------------
    else if (department === "Sport") {


        const baseURL = "sport.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }
    // 16)CEO--------------------------------------
    else if (department === "City Engineer Office") {


        const baseURL = "ceo.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }

    // 17)slum--------------------------------

    else if (department === 'Slum') {


        const baseURL = "slum.html";

        // Create the query string
        const queryString = `?proj_id=${encodeURIComponent(Work_ID)}&lastInsertedId=${encodeURIComponent(conceptualData.id)}&width=${encodeURIComponent(conceptualData.width)}&length=${encodeURIComponent(conceptualData.length)}&wardName=${encodeURIComponent(conceptualData.ward)}&department=${encodeURIComponent(department)}&workType=${encodeURIComponent(conceptualData.work_type)}&struct_no=${encodeURIComponent(conceptualData.struct_no)}&user_id=${encodeURIComponent(conceptualData.struct_no)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=${encodeURIComponent(id.replace(/"/g, ''))}`;

        // Redirect to the new URL with query parameters
        window.location.href = baseURL + queryString;
    }


    //  window.location.href = `road.html?proj_id=${encodeURIComponent(id)}&width=${encodeURIComponent(bufferWidth)}&length=${encodeURIComponent(roadLength)}&wardName=${encodeURIComponent(wardName)}&zone_id=${encodeURIComponent(project.gis_zone_id)}&ward_id=${encodeURIComponent(project.gis_ward_id)}&prabhag_id=${encodeURIComponent(project.gis_prabhag_id)}&edit="true"&editId=` + id.replace(/"/g, '');
}

$(document).ready(function () {
    var urlParams = new URLSearchParams(window.location.search);
    var villageName = urlParams.get('Work_ID');
    var filter = "Work_ID = " + villageName;


    console.log(villageName, "work id", filter);
    //    FitbouCustomiseRevenue(filter);

    IWMS_line.setParams({ CQL_FILTER: filter, maxZoom: 19.5, styles: "IWMS_line" }).addTo(map);
    IWMS_polygon.setParams({ CQL_FILTER: filter, maxZoom: 19.5, styles: "IWMS_polygon" }).addTo(map);
    IWMS_point.setParams({ CQL_FILTER: filter, maxZoom: 19.5, styles: "IWMS_points" }).addTo(map);
    Ward_layer.setParams({ CQL_FILTER: filter, maxZoom: 19.5, styles: "GIS_Ward_Layer" }).addTo(map);

    getdata(filter);

    function getdata(filters) {
        const layers = ["pmc:IWMS_line", "pmc:IWMS_polygon", "pmc:IWMS_point", "pmc:GIS_Ward_Layer"];
        const promises = [];
        const layerDetails = ["id", "Work_ID", "Name_of_Work", "Department", "Project_Office", "zone", "ward", "Tender_Amount", "Name_of_JE", "length_1", "width", "area", "geometry"];

        layers.forEach(function (layerName) {
            const urlm = "https://iwmsgis.pmc.gov.in/geoserver/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
                layerName +
                "&CQL_FILTER=" +
                filters +
                "&outputFormat=application/json";

            $('#table-container').show();

            const promise = $.getJSON(urlm).then(function (data) {
                return data.features.map(feature => {
                    const properties = feature.properties;
                    let filteredData = {};
                    layerDetails.forEach(key => {
                        if (properties[key] !== undefined && properties[key] !== null) {
                            filteredData[key] = properties[key];
                        } else if (feature[key] !== undefined) {
                            // console.log("hhhhhhhhhhhhh", feature)
                            filteredData[key] = JSON.stringify(feature[key]);
                        }
                    });
                    filteredData.geometry = feature.geometry;
                    return filteredData;
                });
            });

            promises.push(promise);
        });

        Promise.all(promises).then(function (results) {
            const flattenedResults = results.flat();
            paginateResults(flattenedResults);
        }).catch(function (error) {
            console.error("An error occurred: ", error);
        });
    }

    function paginateResults(data) {
        const itemsPerPage = 1;
        let currentPage = 1;



        function displayPage(page) {
            console.log(page);
            const tableBody = document.getElementById('workTableData');
            tableBody.innerHTML = '';

            if (data.length === 0) {
                const emptyMessage = document.createElement('tr');
                emptyMessage.className = 'empty-message';
                emptyMessage.innerHTML = '<td colspan="2">No data available.</td>';
                tableBody.appendChild(emptyMessage);
                return;
            }

            const start = (page - 1) * itemsPerPage;
            const end = Math.min(start + itemsPerPage, data.length);
            for (let i = start; i < end; i++) {
                const item = data[i];
                for (const [key, value] of Object.entries(item)) {
                    if (key !== "geometry") {
                        const row = document.createElement('tr');
                        const displayValue = key === 'length_1' ? parseFloat(value).toFixed(2) : value;
                        row.innerHTML = `<td>${key}</td><td>${displayValue}</td>`;
                        tableBody.appendChild(row);
                    }
                }
            }
            const editRow = document.createElement('tr');
            editRow.classList.add('no-bottom-border');
            const editButtonCell = document.createElement('td');
            editButtonCell.colSpan = 2;
            editButtonCell.style.textAlign = 'center';
            const department = data[page - 1].Department.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            const id = data[page - 1].id
            //.replace(/'/g, "\\'").replace(/"/g, '&quot;');
            console.log(data[page - 1]);
            const Work_ID = data[page - 1].Work_ID;


            // editButtonCell.innerHTML = `<button type="button" onclick="onClickEdit('${department}', '${id}','${Work_ID}')" class="edit-button"><i class="fas fa-pen"></i>&nbsp;Edit</button>`;



            editRow.appendChild(editButtonCell);
            tableBody.appendChild(editRow);

            const paginationControls = document.getElementById('pagination-controls');
            paginationControls.innerHTML = '';
            highlightFeature(data[start].geometry);
            updatePagination(page);

        }

        function updatePagination(page) {
            const paginationControls = document.getElementById('pagination-controls');
            paginationControls.innerHTML = '';

            const totalPages = Math.ceil(data.length / itemsPerPage);

            const prevButton = document.createElement('button');

            prevButton.innerHTML = '<';

            prevButton.classList.add('arrow');
            prevButton.disabled = page === 1;
            prevButton.addEventListener('click', () => {
                if (page > 1) {
                    displayPage(page - 1);
                }
            });
            paginationControls.appendChild(prevButton);

            const maxVisiblePages = 5;
            let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
            let endPage = startPage + maxVisiblePages - 1;
            if (endPage > totalPages) {
                endPage = totalPages;
                startPage = Math.max(1, endPage - maxVisiblePages + 1);
            }



            for (let i = startPage; i <= endPage; i++) {
                const button = document.createElement('button');
                button.textContent = i;
                button.classList.add('page-num');
                if (i === page) {
                    button.style.fontWeight = 'bold';
                }
                button.addEventListener('click', () => {
                    displayPage(i);
                });
                paginationControls.appendChild(button);
            }



            const nextButton = document.createElement('button');
            nextButton.innerHTML = '>';

            nextButton.classList.add('arrow');
            nextButton.disabled = page === totalPages;
            nextButton.addEventListener('click', () => {
                if (page < totalPages) {
                    displayPage(page + 1);
                }
            });
            paginationControls.appendChild(nextButton);
        }

        function highlightFeature(geometry) {
            if (highlightLayer) {
                map.removeLayer(highlightLayer);
            }
            highlightLayer = L.geoJSON(geometry, {
                style: {
                    color: '#0000FF',
                    weight: 5,
                    opacity: 0.65
                }
            }).addTo(map);
            map.fitBounds(highlightLayer.getBounds());
        }

        // Display initial page
        displayPage(currentPage);
    }

    function FitbouCustomiseRevenue(filter) {
        const layers = ["pmc:IWMS_line", "pmc:IWMS_polygon", "pmc:IWMS_point", "pmc:GIS_Ward_Layer"];
        let bounds = L.latLngBounds();
        let pendingRequests = layers.length;

        layers.forEach(function (layerName) {
            const urlm = geoserverUrl + "/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" +
                layerName +
                "&CQL_FILTER=" +
                filter +
                "&outputFormat=application/json";

            $.getJSON(urlm, function (data) {
                const geojson = L.geoJson(data, {});
                if (geojson && geojson.getBounds && geojson.getBounds().isValid()) {
                    bounds.extend(geojson.getBounds());
                }

                pendingRequests--;
                if (pendingRequests === 0 && bounds.isValid()) {
                    map.fitBounds(bounds);
                }
            });
        });
    }



});
$(document).ready(function () {
    // Your existing document ready code...

    function printPage() {
        window.print();
    }

    // Move the onclick assignment inside the document ready block
    document.getElementById("generatePdfBtn").onclick = printPage;
});
