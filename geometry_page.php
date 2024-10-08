<?php
session_start();
if (!isset($_SESSION['loggedin']) || $_SESSION['loggedin'] !== true) {
    header("Location: login/login.php");
    exit;
}

// Database connection
require_once 'APIS/db.php';

// Fetch user details from the database
$username = $_SESSION['username']; // Assuming this is set during login
$userData = null;

try {
    $stmt = $pdo->prepare("SELECT username, contact_no FROM users_login WHERE username = :username");
    $stmt->bindParam(':username', $username);
    $stmt->execute();
    $userData = $stmt->fetch(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}

// If user data is not found, handle it accordingly
if (!$userData) {
    // Handle case where user data is not found
    $userData = [
        'username' => 'Unknown User',
        'contact_no' => 'N/A'
    ];
}
?>



<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>PMC</title>
    <link rel="icon" href="png/pmcjpeg.png" type="image/x-icon" />

    <!-- External CSS -->
    <link rel="stylesheet" href="css/geo_mobview.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/boxicons@latest/css/boxicons.min.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/css/bootstrap.min.css" />
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.7/css/dataTables.bootstrap5.min.css" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet-draw/dist/leaflet.draw.css" />
    <link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css" />
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/css/select2.min.css" />

    <!-- External JavaScript -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta1/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet-ajax/dist/leaflet.ajax.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.datatables.net/1.13.7/js/dataTables.bootstrap5.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.0/jspdf.umd.min.js"></script>
    <script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/select2@4.1.0-rc.0/dist/js/select2.min.js"></script>
    <script src="https://unpkg.com/leaflet-draw/dist/leaflet.draw.js"></script>

    <style>
       /* General Modal Styles */
/* Modal Dialog: Adjust width and remove extra margins */
.modal-dialog {
    max-width: 500px; 
    margin: 1rem auto; 
}
.modal-content {
    border-radius: 15px;
    border: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
    background-color: #f9f9f9;
    padding: 1rem; 
}

.modal-header {
    background-color: #0077DA;
    color: white;
    border-bottom: none;
    padding: 0.75rem 1rem; 
    border-top-left-radius: 15px;
    border-top-right-radius: 15px;
}

.modal-title {
    font-size: 1.125rem; 
    font-weight: 600;
}

.btn-close {
    border: none;
    color: white;
    font-size: 1rem;
    opacity: 0.8;
}

.modal-body {
    padding: 1rem; 
}

.form-label {
    font-size: 12px;
    font-weight: 600;
    color: #555;
    margin-bottom: 0.25rem;
}

.form-control, .form-select {
    background: white;
    border: 1px solid #ced4da;
    border-radius: 8px;
    padding: 0.5rem;
    font-size: 0.875rem;
    color: #495057;
}

.modal-footer {
    padding: 0.5rem 1rem; 
    border-top: none;
    display: flex;
    justify-content: space-between;
}

.modal-footer .btn {
    padding: 0.5rem 1rem; 
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 600;
}

.btn-secondary, .btn-primary {
    min-width: 100px; 
}

#workDetailsModal {
    position: absolute;
    z-index: 99999;
    height: 100vh;
    top: 76px;
    overflow: auto;
    scrollbar-width: thin;
}

@media (max-width: 768px) {
    .modal-dialog {
        max-width: 100%;
        margin: 0.5rem auto; 
    }

    .modal-content {
        padding: 0.75rem; 
    }

    .modal-header, .modal-footer {
        padding: 0.5rem 1rem; 
    }

    .modal-body {
        padding: 0.5rem; 
    }
}

#successModal .modal-dialog {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh; 
}

#successModal .modal-content {
    margin: auto; 
}

    </style>
    

</head>


<body class="bg-light">

    <!-- Header Section -->
    <header class="header">
        <!-- Logo -->
        <div class="header-logo">
            <img src="png/pmcjpeg.png" alt="PMC Logo">
        </div>

        <!-- User Info and Dropdown -->
        <div class="user-info dropdown">

            <button class="btn btn-border-none dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                <span class="user-name"><?php echo htmlspecialchars(strtoupper($userData['username'])); ?></span>
            </button>
            <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li><a class="dropdown-item border-none" href="./login/logout.php">Logout <i class="fa fa-sign-out" style="color: red;"></i></a></li>
            </ul>
        </div>
    </header>

    <div id="loader" style="display:none;">Loading...</div>

    <p id="workIDInfo">Loading...</p>
    <!-- <img src="png/pmcjpeg.png" alt="" class="logopng1" /> -->
    <div id="content" style="width: 100%" class="container">
        <div id="button-container" class=""></div>

        <section id="map-section" class="">
            <form class="mt-3" style="overflow: hidden">
                <div style="margin: 0; float: left">
                    <h5 class="text-secondary">Preview Map</h5>
                </div>
                <div style="float: right; margin-top: -35px; margin-left: 95%">
                    <!-- Form Button -->
                    <button type="button" class="btn btn-primary" id="formButton" data-bs-toggle="modal"
                        data-bs-target="#workDetailsModal">
                        Feedback +
                    </button>
                    <!-- Print Button -->
                    <i class="fa-solid fa-print text-primary" id="generatePdfBtn" onclick="printPage()"
                        style="font-size: 25px"></i>
                </div>
                <div id="map"></div>
                <a class="geopulseaname"
                    style="color: darkblue; position: absolute; z-index: 99999; bottom: 0.5%; right: 0; font-weight: bold; font-size: 10px;">@GeoPulse
                    Analytics</a>
                <div id="table-container">
                    <table id="workTable" class="table table-bordered table-hover"
                        style="width: 100% !important; font-size: 10px; border-radius: 10px;">
                        <thead>
                            <tr>
                                <th>Attribute</th>
                                <th>Value</th>
                            </tr>
                        </thead>
                        <tbody id="workTableData">
                        </tbody>
                    </table>
                    <div id="pagination-controls" class="pagination">
                    </div>
                </div>
            </form>
        </section>
    </div>

    <!-- Modal Structure -->
    <div class="modal fade" id="workDetailsModal" tabindex="-1" aria-labelledby="workDetailsModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="workDetailsModalLabel">Work Details</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <div class="modal-body">
                    <form id="workDetailsForm" method="POST" action="APIS/save_form_work.php">


                        <div class="form-row mb-2">
                            <label for="username" class="form-label">Username</label>
                            <input type="text" class="form-control" id="username" name="username" value="<?php echo htmlspecialchars(strtoupper($userData['username'])); ?>" readonly>
                        </div>

                        <div class="form-row mb-2">
                            <label for="contact" class="form-label">Contact</label>
                            <input type="tel" class="form-control" id="contact" name="contact" value="<?php echo htmlspecialchars($userData['contact_no']); ?>" readonly>
                        </div>


                        <div class="form-row mb-2">
                            <label for="fid" class="form-label">FID</label>
                            <input class="form-control" id="fid" name="fid" readonly>
                        </div>
                        <div class="form-row mb-2">
                            <label for="workId" class="form-label">Work ID</label>
                            <input type="text" class="form-control" id="workId" name="workId" readonly>
                        </div>
                        <div class="form-row mb-2">
                            <label for="department" class="form-label">Department</label>
                            <input type="text" class="form-control" id="department" name="department" readonly>
                        </div>



                        <div class="form-row mb-2">
                            <label for="category" class="form-label">Category</label>

                            <select class="form-select form-select1" id="category" name="category" required>
                                <option value="">-- Select Category --</option>
                                <option value="1">रस्ते</option>
                                <option value="2">फूटपाथ</option>
                                <option value="3">भवन</option>
                                <option value="4">मलनिःसारण</option>
                                <option value="5">पाणीपुरवठा</option>
                                <option value="6">विद्युत</option>
                                <option value="6">अतिक्रमण</option>
                                <option value="6">उद्यान</option>
                                <option value="6">घनकचरा</option>
                                <option value="6">पर्यावरण</option>
                                <option value="6">क्रिडा</option>
                                <option value="6">झोपडपट्टी</option>
                                <option value="6">प्राथमिक शिक्षण</option>
                                <option value="6">वृक्ष प्राधिकरण</option>
                                <option value="6">मुख्य अभियंता प्रकल्प</option>

                            </select>
                        </div>

                        <div class="form-row mb-2" id="subcategory-wrapper" style="display:none;">
                            <label for="subcategory" class="form-label">Subcategory</label>
                            <select class="form-select form-select2" id="subcategory" name="subcategory" required>


                            </select>
                        </div>

                        <div class="form-row mb-2 " id="otherTextWrapper" style="display:none;">
                            <label for="otherText" class="form-label">Please specify</label>
                            <input type="text" class="form-control" id="otherText" name="otherText" placeholder="Enter details" />
                        </div>



                        <div class="rate mb-2">
                            <p class="fw-bold mt-2">Rate Us:</p>
                            <div class="rating d-flex justify-content-between">
                                <input type="radio" name="rating" id="5-stars" value="5" />
                                <label for="5-stars" class="star" data-rating="5">&#9733;</label>
                                <input type="radio" name="rating" id="4-stars" value="4" />
                                <label for="4-stars" class="star" data-rating="4">&#9733;</label>
                                <input type="radio" name="rating" id="3-stars" value="3" />
                                <label for="3-stars" class="star" data-rating="3">&#9733;</label>
                                <input type="radio" name="rating" id="2-stars" value="2" />
                                <label for="2-stars" class="star" data-rating="2">&#9733;</label>
                                <input type="radio" name="rating" id="1-star" value="1" />
                                <label for="1-star" class="star" data-rating="1">&#9733;</label>
                            </div>
                            <div id="rating-label" class="text-center mt-2"></div>
                        </div>

                        <div class="modal-footer d-flex justify-content-between">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="submit" class="btn btn-primary" id="saveChangesBtn">Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Success Message Modal -->
    <div class="modal fade" id="successModal" tabindex="-1" aria-labelledby="successModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="successModalLabel">Success</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    Your form has been successfully submitted!
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                </div>
            </div>
        </div>
    </div>

    <script src="js/geometry_page.js"></script>
    <script>
        // Function to retrieve Work_ID from the URL
        function getWorkID() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('Work_ID');
        }

        // Display Work_ID on the page
        const workID = getWorkID();
        if (workID) {
            document.getElementById('workIDInfo').textContent = `Work ID: ${workID}`;
        } else {
            document.getElementById('workIDInfo').textContent = 'No Work ID provided.';
        }
    </script>

    <script>
        let depData = [{
                department_id: '1',
                department_name: 'Road',
                department_marathi_name: 'पथ',
                department_code: '21',
            },
            {
                department_id: '2',
                department_name: 'Building',
                department_marathi_name: 'भवन',
                department_code: '78',
            },
            {
                department_id: '3',
                department_name: 'Project Work',
                department_marathi_name: 'प्रकल्प',
                department_code: '',
            },
            {
                department_id: '4',
                department_name: 'Water Supply',
                department_marathi_name: 'पाणीपुरवठा',
                department_code: '',
            },
            {
                department_id: '5',
                department_name: 'Drainage',
                department_marathi_name: 'मलनिःसारण देखभाल व दुरुस्ती',
                department_code: '',
            },
            {
                department_id: '6',
                department_name: 'Electrical',
                department_marathi_name: 'विद्युत',
                department_code: '',
            },
            {
                department_id: '7',
                department_name: 'Solid waste Management',
                department_marathi_name: 'घनकचरा',
                department_code: '',
            },
            {
                department_id: '8',
                department_name: 'PMAY',
                department_marathi_name: 'प्रधानमंत्री आवास योजना',
                department_code: '',
            },
            {
                department_id: '9',
                department_name: 'Garden',
                department_marathi_name: 'उद्यान ',
                department_code: '',
            },
            {
                department_id: '14',
                department_name: 'Education Department (Primary)',
                department_marathi_name: 'शिक्षण विभाग (प्राथमिक)',
                department_code: 'EDU',
            },
            {
                department_id: '11',
                department_name: 'Slum',
                department_marathi_name: 'झोनिपु',
                department_code: '',
            },
            {
                department_id: '12',
                department_name: 'Encroachment ',
                department_marathi_name: 'अतिक्रमण',
                department_code: '',
            },
            {
                department_id: '13',
                department_name: 'Garden Horticulture',
                department_marathi_name: 'उद्यान',
                department_code: 'GRHOR',
            },
            {
                department_id: '10',
                department_name: 'Market',
                department_marathi_name: 'मंडई',
                department_code: '',
            },
            {
                department_id: '16',
                department_name: 'Sport',
                department_marathi_name: 'क्रीडा',
                department_code: '',
            },
            {
                department_id: '17',
                department_name: 'City Engineer Office',
                department_marathi_name: 'शहर अभियंता कार्यालय',
                department_code: 'CTEO',
            },
            {
                department_id: '18',
                department_name: 'Environment',
                department_marathi_name: 'पर्यावरण',
                department_code: 'EVMT',
            },
        ];


        let userIP = '';
        let userLocation = '';

        document.addEventListener("DOMContentLoaded", function() {


            // Ensure that geolocation is supported
            if ("geolocation" in navigator) {
                const options = {
                    enableHighAccuracy: true,
                    timeout: 5000,
                    maximumAge: 2000,
                };

                navigator.geolocation.getCurrentPosition(function(position) {
                    const lat = position.coords.latitude;
                    const lng = position.coords.longitude;
                    userLocation = `${lat},${lng}`;
                    console.log(`Live Location: ${userLocation}`);
                }, function(error) {
                    console.error("Geolocation error: ", error);
                }, options);
            } else {
                alert("Geolocation is not supported by this browser.");
            }

            $.getJSON('https://api.ipify.org?format=json', function(data) {
                userIP = data.ip;
                console.log(userIP, "userIP");
            });

            // Fetch the Work_ID dynamically from the URL or wherever it is stored
            const urlParams = new URLSearchParams(window.location.search);
            const workId = urlParams.get('Work_ID'); // Assuming Work_ID is passed in the URL
            console.log('Work_ID:', workId);

            // Function to find the department name based on d_id
            function getDepartmentNameById(d_id) {
                const department = depData.find(dep => dep.department_id === d_id);
                return department ? department.department_name : '';
            }

            // Function to fetch and display data
            function fetchAndDisplayData() {
                $.ajax({
                    url: `https://iwms.punecorporation.org/api/project-gis-data?proj_id=${workId}`, // Correctly format the URL
                    method: 'GET',
                    dataType: 'json',
                    success: function(response) {
                        // Extract the necessary data from the response
                        if (response && response.data) {
                            const fid = response.gis_data[0].gis_id || ''; // Using sys_aa_id as FID
                            const d_id = response.data.d_id || ''; // Get the d_id from the response
                            const department = getDepartmentNameById(d_id); // Map d_id to department name
                            const workID = response.data.works_aa_approval_id || '';

                            // Populate the form fields
                            $('#fid').val(fid);
                            $('#workId').val(workID);
                            $('#department').val(department);
                        } else {
                            console.error('Unexpected response structure:', response);
                        }
                    },
                    error: function(xhr, status, error) {
                        console.error('Error fetching data:', status, error);
                    }
                });
            }

            // Trigger the fetch and populate when the modal is opened
            document.getElementById('formButton').addEventListener('click', fetchAndDisplayData);

            const ratingLabels = {
                1: "Poor",
                2: "Satisfactory",
                3: "Good",
                4: "Very Good",
                5: "Excellent"
            };

            const stars = document.querySelectorAll('.rating input');
            const labels = document.getElementById('rating-label');

            // Function to update star colors and labels
            function updateStars(rating) {
                stars.forEach(star => {
                    const starLabel = document.querySelector(`label[for="${star.id}"]`);
                    if (star.value <= rating) {
                        starLabel.style.color = getColorForRating(star.value);
                    } else {
                        starLabel.style.color = '#ddd'; // Gray for unselected stars
                    }
                });
                labels.textContent = ratingLabels[rating];
            }

            // Function to get color based on rating
            function getColorForRating(rating) {
                switch (rating) {
                    case '1':
                        return '#e53c3d'; // Poor
                    case '2':
                        return '#f05224'; // Satisfactory
                    case '3':
                        return '#fcb300'; // Good
                    case '4':
                        return '#218be6'; // Very Good
                    case '5':
                        return '#5155d4'; // Excellent
                    default:
                        return '#ddd'; // Default color
                }
            }

            // Add event listeners to each star
            stars.forEach(star => {
                star.addEventListener('change', function() {
                    const rating = this.value;
                    updateStars(rating);
                });
            });

            // Initialize stars
            updateStars(0);


            document.getElementById('category').addEventListener('change', function() {
                const subcategoryWrapper = document.getElementById('subcategory-wrapper');
                const subcategory = document.getElementById('subcategory');
                const otherTextWrapper = document.getElementById('otherTextWrapper');
                const otherText = document.getElementById('otherText');
                subcategory.innerHTML = '';
                otherTextWrapper.style.display = 'none';
                otherText.value = '';

                const selectedCategory = this.value;
                subcategoryWrapper.style.display = 'none';
                if (selectedCategory == "1") {
                    subcategoryWrapper.style.display = 'block';
                    subcategory.innerHTML = `
            <option value="">-- Select Option --</option>
            <option value="1">नव्याने केलेल्या रस्त्यावर पाणी साठत आहे.</option>
            <option value="2">रस्त्याच्या बाजूला पावसाळी लाईन नाही. </option>
            <option value="3">स्त्याचा उतार पावसाळी लाईन कडे ठेवला नाही.  </option>
            <option value="4">नव्याने केलेल्या रस्त्यावर खड्डे झाले आहेत. </option>
            <option value="5">नव्याने केलेला रस्ता धसला आहे. </option>
            <option value="6">नवीन केलेल्या रस्त्यावर भुंगिर दिसत आहे. </option>
            <option value="7">चेंबर / म्यानहोल कवर रस्त्याच्या समपातळीत उचलले नाही.</option>
            <option value="8">चेंबर / म्यानहोल कवर तुटले आहे.</option>
            option value="9">नव्याने केलेल्या रस्त्यावर क्रॉस-कट केले आहेत. </option>
            option value="10">नव्याने केलेल्या सीमेंट कौंक्रीट रस्त्याला तडे पडले आहेत. </option>
            option value="11">नव्याने केलेल्या सीमेंट कौंक्रीट रस्त्याला ग्रूव कटिंग केले नाही. </option>
            option value="12">नव्याने केलेल्या सीमेंट कौंक्रीट रस्त्याच्या ग्रूव कटिंग मध्ये सिलंट भरले नाही.</option>
            option value="13">नव्याने केलेला रस्ता खोदला आहे, परंतु तो सुस्थितीत पुन्हा दुरूस्त केला नाही. </option>
            option value="14">नवीन रास्ता ओबड-धोबड केला आहे. </option>
            option value="15">नवीन रस्त्यावर तुरंत वाहतूक सुरू केली आहे. </option>
            option value="16">रस्त्याच्या बाजूला पार्क केलेल्या वाहनांच्यामुळे नवीन रस्ता त्या जागी केला जात नाही. </option>
            option value="17">स्पीडब्रेकर वरील पेंट केला नाही.</option>
            option value="18">नवीन रस्त्याच्या बाजूला खोदाईतील राडारोडा पडले आहे. </option>
            option value="19">रस्त्यावरील खोदाईच्या बाजूला सेफ्टी ब्यारिगेट लावले नाहीत. </option>
            <option value="20">other</option>
        `;
                } else if (selectedCategory == "2") {
                    subcategoryWrapper.style.display = 'block';
                    subcategory.innerHTML = `
            <option value="">-- Select Option --</option>
            <option value="1">नव्याने केलेल्या फूटपाथ मधील पेविंग ब्लॉक उखडले आहेत. </option>
            <option value="2">नव्याने केलेल्या फूटपाथचे कर्ब-स्टोन तुटले आहेत. </option>
            <option value="3">नव्याने केलेला फूटपाथ धसला आहे. </option>
            <option value="4">नव्याने केलेल्या फूटपाथवरुन दुचाकी वाहतूक होत आहे. </option>
            <option value="5">नव्याने केलेल्या फूटपाथवर अडथळे आहेत. </option>
            <option value="6">फूटपाथवर फेरीवाले आणि इतर विक्रेते बसत आहेत.</option>
            <option value="20">other</option>
            
        `;
                } else if (selectedCategory == "3") {
                    subcategoryWrapper.style.display = 'block';
                    subcategory.innerHTML = `
            <option value="">-- Select Option --</option>
            <option value="1">इमारतीच्या सीमेंट कौंक्रीटला पाण्याने पुरेसे क्युरिंग केले जात नाही.</option>
            <option value="2">इमारतीच्या सीमेंट कौंक्रीटला तडे गेले आहेत./option>
                <option value="3">इमारतीच्या केलेल्या प्लास्टरला पाण्याने क्युरिंग केले जात नाही. </option>
                <option value="4">इमारतीच्या केलेल्या प्लास्टरला तडे गेले आहेत.</option>
                <option value="5">इमारतीच्या काम सुरू असताना सेफ्टीनेट लावले नाहीत.</option>
                <option value="6">साईटवर काम करणार्‍या मजूराला सेफ्टी साठीचे पीपीईस (PPE’S) दिले नाहीत.</option>
                <option value="20">other</option>
        `;
                } else if (selectedCategory == "4") {
                    subcategoryWrapper.style.display = 'block';
                    subcategory.innerHTML = `
            <option value="">-- Select Option --</option>
            <option value="1">ड्रेनेज लाइन मधून लिकेज होत आहे.</option>
            <option value="2">डॅमेज झालेल्या आरसीसी पाईप वापरल्या जात आहेत.</option>
            <option value="3">ड्रेनेज लाइन टाकताना रस्त्यावरील खोदाईच्या बाजूला सेफ्टी ब्यारिगेट लावले नाहीत.</option>
            <option value="4">खोदाई केलेला राडारोडा उचलला नाही.</option>
            <option value="5">ड्रेनेज लाइनचे चेंबर ब्लॉक झाले आहे.</option>
            <option value="6">ड्रेनेज लाइनचे चेंबर कवर तुटले आहे. </option>
            <option value="20">other</option>

        `;
                } else if (selectedCategory == "5") {
                    subcategoryWrapper.style.display = 'block';
                    subcategory.innerHTML = `
            <option value="">-- Select Option --</option>
            <option value="1">पिण्याच्या पाण्याच्या लाइन मधून लिकेज होत आहे.</option>
            <option value="2">पिण्याच्या पाण्याची लाइन टाकताना रस्त्यावरील खोदाईच्या बाजूला सेफ्टी ब्यारिगेट लावले नाहीत.</option>
            <option value="3">खोदाई केलेला राडारोडा उचलला नाही.</option>
            <option value="4">पिण्याच्या पाण्याच्या लाइनवर बसविलेले स्लुस-वाल्हला पेटी बांधली नाही. </option>
            <option value="5">पिण्याच्या पाण्याच्या लाइनवर बसविलेले स्लुस-वाल्हला पेटीवर झाकण नाही. </option>
            <option value="6">पिण्याच्या पाण्याच्या लाइनवर बसविलेले स्लुस-वाल्ह रस्त्याच्या वर आला आहे. </option>
            <option value="20">other</option>
        `;
                } else if (selectedCategory == "6") {
                    subcategoryWrapper.style.display = 'block';
                    subcategory.innerHTML = `
            <option value="">-- Select Option --</option>
            <option value="20">other</option>
        `;
                }

            });

            document.getElementById('subcategory').addEventListener('change', function() {
                const otherTextWrapper = document.getElementById('otherTextWrapper');
                if (this.value === '20') { // Show input field if 'other' is selected
                    otherTextWrapper.style.display = 'block';
                } else {
                    otherTextWrapper.style.display = 'none';
                }
            });

            document.getElementById('saveChangesBtn').addEventListener('click', function(e) {
                const rating = document.querySelector('input[name="rating"]:checked');
                const categoryElement = document.getElementById('category');
                const subcategoryElement = document.getElementById('subcategory');

                // Get the selected text for category and subcategory
                const category = categoryElement.options[categoryElement.selectedIndex].text;
                const subcategory = subcategoryElement.options[subcategoryElement.selectedIndex].text;

                const otherText = document.getElementById('otherText').value;

                // Ensure all required fields are filled
                if (!rating || !category || (!subcategory && !otherText)) {
                    e.preventDefault();
                    alert('Please fill in all required fields.');
                    return;
                }
                // Disable the submit button to prevent multiple submissions
                this.disabled = true;

                document.getElementById('loader').style.display = 'block'; // Show loader
                // Append form data and submit
                const form = document.getElementById('workDetailsForm');
                const formData = new FormData(form);
                formData.append('rating', rating.value);
                formData.append('live_location', userLocation);
                formData.append('ip_address', userIP);
                formData.append('category', category);
                formData.append('subcategory', subcategory);

                if (subcategory === '20') { // Append 'other' text if 'other' option is selected
                    formData.append('otherText', otherText);
                }


                fetch('APIS/save_form_work.php', {
                        method: 'POST',
                        body: formData
                    })
                    .then(response => response.text())
                    .then(data => {
                        // Hide loader
                        document.getElementById('loader').style.display = 'none';
                        $('#successModal').modal('show');
                        setTimeout(function() {
                            $('#successModal').modal('hide');
                        }, 3000);
                        form.reset();
                        $('#workDetailsModal').modal('hide');

                        // Hide loader and re-enable the button if there's an error
                        document.getElementById('loader').style.display = 'none';
                        this.disabled = false;
                    })
                    .catch(error => console.error('Error:', error));
            });
        });
    </script>
</body>

</html>