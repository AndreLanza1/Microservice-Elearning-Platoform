async function signOut() {
    console.log("Logout function called");
    try {
        const logoutUrl = getDynamicUrl(8080, '/logout');
        const response = await fetch(logoutUrl, {       
            method: 'POST',
            credentials: 'include' 
        });
        if (response.status === 200) {
            console.log("Logout successful");
            window.location.href = getDynamicUrl(8080, '/');
        }
    }
    catch (error) {
        console.error('Error during sign-out:', error);
    }
}

async function personalData() {
  console.log("Personal data function called");
  window.location.href = getDynamicUrl(8080, '/personalData');
}

// If role is student
const role = sessionStorage.getItem("userRole");
if (role == "student") {
  // Show student-specific content
  const addButton = document.getElementById("addbutton");
  addButton.style.display = "none"; // Hide the add button for students
}

document.addEventListener('DOMContentLoaded', () => {
  const fileButton = document.getElementById("fileButton");
  const fileInput = document.getElementById("fileInput");
  const addButton = document.getElementById("addbutton");
  const containerButton = document.getElementById("containerbutton");

  if (addButton && containerButton) {
    addButton.addEventListener('click', () => {
      containerButton.style.display = (containerButton.style.display === 'none') ? 'block' : 'none';
    });
  }

  if (fileButton) fileButton.addEventListener("click", triggerFileInput);
  if (fileInput) fileInput.addEventListener("change", handleFileChange);

  populateCourseDetails();
  const { courseId } = getQueryParams();
  if (courseId) loadMaterials(courseId);
  if (courseId) fetchStudents(courseId);  
});

async function fetchStudents(courseId) {
  try {
    const response = await fetch(`/getStudentsByCourseID/${courseId}`);
    const studentIds = await response.json(); // Assuming this is an array of student IDs
    console.log('Student IDs received from the server:', studentIds);

    if (studentIds) {
      // Store each student ID in localStorage
      studentIds.forEach((id, index) => {
        localStorage.setItem(`studentId_${index}`, id);
      });
    }
  } catch (error) {
    console.log("Error in fetching student IDs:", error);
  }
}

// Clear student IDs from localStorage when exiting the page
window.addEventListener('beforeunload', () => {
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('studentId_')) {
      localStorage.removeItem(key);
    }
  });
});

async function openStudents() {
  let studIds=[];
  // Iterate through localStorage to collect all student IDs
  Object.keys(localStorage).forEach((key) => {
    if (key.startsWith('studentId_')) {
      studIds.push(localStorage.getItem(key)); // Add the student ID to the array
    }
  });

  console.log("Collected student IDs:", studIds);
  loadStudentsByCourse(studIds);
  const publicationsContainer = document.getElementById('publicationsContainer');
  const studentsBox = document.getElementById('students-box');

  // Show students, hide announcements
  studentsBox.style.display = 'block';
  publicationsContainer.style.display = 'none';
}

// Funzione per calcolare dinamicamente l'URL (Locale o GitHub Codespaces)
function getDynamicUrl(port, path) {
    const currentHost = window.location.hostname;
    
    // Se siamo su GitHub Codespaces
    if (currentHost.includes('github.dev')) {
        // Cerca la porta attuale nell'URL e la sostituisce con la porta di destinazione
        const newHost = currentHost.replace(/-\d+\.app\.github\.dev/, '-' + port + '.app.github.dev');
        return window.location.protocol + "//" + newHost + path;
    }
    
    // Altrimenti, usa il localhost standard 
    return "http://localhost:" + port + path;
}

// Funzione da usare direttamente nell'HTML
function navigateTo(port, path) {
    window.location.href = getDynamicUrl(port, path);
}

function open_Menu() {
  document.getElementById("mySidebar").style.width = "25%";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("overlaybar").classList.add("overlayactive");
}

function close_Menu() {
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("overlaybar").classList.remove("overlayactive");
}

function open_Profile() {
  document.getElementById("profileSidebar").style.width = "25%";
  document.getElementById("profileSidebar").style.display = "block";
  document.getElementById("overlaysidebar").classList.add("overlayactive");
}

function close_Profile() {
  document.getElementById("main").style.marginLeft = "0%";
  document.getElementById("profileSidebar").style.display = "none";
  document.getElementById("overlaysidebar").classList.remove("overlayactive");
}

function openPopup(popup, overlay) {
  document.getElementById(popup).classList.add("popupactive");
  document.getElementById(overlay).classList.add("overlayactive");
}

function closePopup(popup, overlay) {
  document.getElementById(popup).classList.remove("popupactive");
  document.getElementById(overlay).classList.remove("overlayactive");
}

function changeTag(box, tag){
  if ( tag == 'Arts & Design'){
    box.classList.add("art");
  }
  if ( tag == 'Business & Management'){
    box.classList.add("bam");
  }
  if ( tag == 'Communication & Media'){
    box.classList.add("cam");
  }
  if ( tag == 'Engineering & Technology'){
    box.classList.add("engandtech");
  }
  if ( tag == 'Health & Life Sciences'){
    box.classList.add("handlife");
  }
  if ( tag == 'Humanities'){
    box.classList.add("human");
  }
  if ( tag == 'Law & Legal Studies'){
    box.classList.add("law");
  }
  if ( tag == 'Mathematical Sciences'){
    box.classList.add("math");
  }
  if ( tag == 'Natural Sciences'){
    box.classList.add("natty");
  }
  if ( tag == 'Social Sciences'){
    box.classList.add("social");
  }
}

function changeColor(courseTitle, tag){
  if ( tag == 'Arts & Design'){
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow= "2px 2px 5px grey";
  }
  if ( tag == 'Business & Management'){
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow= "2px 2px 7px black";
  }
  if ( tag == 'Communication & Media'){
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow= "2px 2px 7px grey";
  }
  if ( tag == 'Engineering & Technology'){
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow= "2px 2px 7px black";
  }
  if ( tag == 'Health & Life Sciences'){
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow= "2px 2px 5px grey";
  }
  if ( tag == 'Humanities'){
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow= "2px 2px 7px grey";
  }
  if ( tag == 'Law & Legal Studies'){
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow= "2px 2px 7px grey";
  }
  if ( tag == 'Mathematical Sciences'){
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow= "2px 2px 7px black";
  }
  if ( tag == 'Natural Sciences'){
    courseTitle.style.color = "darkgreen";
    courseTitle.style.textShadow= "2px 2px 7px grey";
  }
  if ( tag == 'Social Sciences'){
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow= "2px 2px 7px black";
  }
}


function getQueryParams() {
  return {
    courseId: localStorage.getItem("courseId"),
    title: localStorage.getItem("title"),
    professor: localStorage.getItem("professor"),
    subject: localStorage.getItem("subject")
  };
}

function populateCourseDetails() {
  const { title, subject } = getQueryParams();
  const courseTitle = document.getElementById('courseTitle');
  const tagTitle = document.getElementById('titlebox');
  if (courseTitle && tagTitle) {
    courseTitle.textContent = title;
    changeColor(courseTitle, subject);
    changeTag(tagTitle, subject);
  }
}

function getOriginalFileName(filePath) {
  const fullName = filePath.split('/').pop();
  const ext = fullName.split('.').pop();
  const base = fullName.slice(0, -(ext.length + 1));
  const nameParts = base.split('_');
  nameParts.pop();
  return nameParts.join('_') + '.' + ext;
}

let selectedFile = null;

async function publishMaterial() {
  const description = document.getElementById('Textarea').value.trim();
  const { courseId } = getQueryParams();

  if (!description) {
    alert('Please insert a description.');
    return;
  }

  const formData = new FormData();
  formData.append('courseId', courseId);
  formData.append('description', description);
  if (selectedFile) formData.append('file', selectedFile);

  try {
    const response = await fetch('/publishMaterial', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

    const result = await response.json();
    console.log('Materiale pubblicato con successo:', result);

    loadMaterials(courseId);
    closePopup('popup', 'overlay');
    document.getElementById('Textarea').value = '';
    clearFile();
  } catch (error) {
    console.error('Errore nella pubblicazione del materiale:', error);
  }
}

async function loadMaterials(courseId) {
  try {
    const response = await fetch(`/by-course-id/${courseId}`);
    if (!response.ok) throw new Error(`Errore HTTP: ${response.status}`);

    const materials = await response.json();
    console.log('Materiali trovati:', materials);

    const container = document.getElementById('publicationsContainer');
    container.innerHTML = '';
    const { professor } = getQueryParams();

    materials.forEach(mat => {
      const pub = document.createElement('div');
      pub.className = 'pubblication';

      const h1 = document.createElement('h1');
      h1.textContent = "Prof. " + professor;
      pub.appendChild(h1);

      const h2 = document.createElement('h2');
      h2.textContent = new Date(mat.date).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
      });
      pub.appendChild(h2);

      const h3 = document.createElement('h3');
      h3.textContent = mat.description;
      pub.appendChild(h3);

      if (mat.file_url && mat.file_type) {
        const downloadButton = document.createElement('a');
        downloadButton.href = mat.file_url;
        downloadButton.download = '';
        downloadButton.classList.add('download-button');

        const extension = mat.file_url.split('.').pop().toLowerCase();
        const iconClass = extension === 'pdf' ? 'fa-file-pdf'
                          : ['jpg', 'jpeg', 'png'].includes(extension) ? 'fa-image'
                          : ['mp4', 'webm'].includes(extension) ? 'fa-video'
                          : 'fa-file';

        const displayedName = getOriginalFileName(mat.file_url);
        downloadButton.innerHTML = `<i class="fa-solid ${iconClass}"></i>&nbsp;${displayedName}`;
        pub.appendChild(downloadButton);
      }

      container.appendChild(pub);
    });

  } catch (error) {
    console.error('Errore durante il recupero dei materiali:', error);
  }
}

function triggerFileInput() {
  if (!selectedFile) document.getElementById("fileInput").click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  const button = document.getElementById("fileButton");

  if (!file) return;

  const ext = file.name.split('.').pop().toLowerCase();
  const allowed = ['pdf', 'jpg', 'jpeg', 'png', 'mp4', 'webm'];
  if (!allowed.includes(ext)) {
    alert("File type not supported. Please upload a PDF, image, or video.");
    clearFile();
    return;
  }

  selectedFile = file;

  const iconClass = ext === 'pdf' ? 'fa-file-pdf'
                   : ['jpg', 'jpeg', 'png'].includes(ext) ? 'fa-image'
                   : ['mp4', 'webm'].includes(ext) ? 'fa-video'
                   : 'fa-file';

  button.innerHTML = `<i class="fa-solid ${iconClass}"></i>&nbsp;${file.name} <span class="remove-icon">&#10006;</span>`;
  button.querySelector(".remove-icon").addEventListener("click", removeFile);
}

function clearFile() {
  document.getElementById("fileInput").value = '';
  selectedFile = null;
  document.getElementById("fileButton").innerHTML = "Add File +";
}

function removeFile(event) {
  if (event && event.stopPropagation) event.stopPropagation();
  clearFile();
}


function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

async function loadStudentsByCourse(studentIds) {
  try {
    // Fetch all student names in parallel using Promise.all
    const students =await fetch('/getUsernames', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Cache-Control': 'no-cache',
          },
          body: JSON.stringify({ id: studentIds, target: "getUsernames" }),
      });

      if(students.status === 200) {
          const res = await students.json();
          console.log(students);
          const usernames = res.response.content;
          //console.log("Student name fetched successfully:", students);
      
    // Filter out any null values (in case of errors)

    console.log("The students' names are:", usernames);
        // Ensure usernames is an array
      
    // Update the UI with the fetched student names
    const studentsBox = document.getElementById('students-box');
    studentsBox.innerHTML = ''; // Clear previous content

    if (usernames.length > 0) {
      if (!Array.isArray(usernames)) {
        
        const profileLetter = JSON.parse(usernames).charAt(0).toUpperCase();
        const studentDiv = document.createElement('div');
        studentDiv.className = 'student';
        const randomColor = getRandomColor();
        studentDiv.innerHTML = `
            <div class="profile_letter" style="background-color: ${randomColor};">${profileLetter}</div>
            <h1>${JSON.parse(usernames)}</h1>
          `;

          // Add the student div to the students-box section
          studentsBox.appendChild(studentDiv);
      }
      else{
        usernames.forEach((student, index) => {
          const profileLetter = student.charAt(0).toUpperCase();

          // Create the div for the student
          const studentDiv = document.createElement('div');
          studentDiv.className = 'student';

          const randomColor = getRandomColor();

          studentDiv.innerHTML = `
            <div class="profile_letter" style="background-color: ${randomColor};">${profileLetter}</div>
            <h1>${student}</h1>
          `;

          // Add the student div to the students-box section
          studentsBox.appendChild(studentDiv);

          // If not the last student, add a separator
          if (index < usernames.length - 1) {
            const separator = document.createElement('div');
            separator.className = 'student-separator';
            studentsBox.appendChild(separator);
          }
        });
    }
    } else {
      studentsBox.innerHTML = 'There aren\'t students enrolled';
    }
    }
      else{
          console.error("Failed to fetch student name:", students.statusText);
      }

  } catch (err) {
    console.error('Error loading students:', err);
  }
}