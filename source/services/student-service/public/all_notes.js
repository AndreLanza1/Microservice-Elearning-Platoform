
const filterSelect = document.getElementById('courseFilter');


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

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function search(prefix) {

  const container = document.getElementById('note-box');
  const boxes = container.querySelectorAll('.box');
  let found = 0;

  boxes.forEach(box => {
    const text = box.querySelector('h2').textContent.toLowerCase();
    console.log(text);
    console.log(prefix);
    console.log(text.startsWith(prefix.toLowerCase()));
    if (text.startsWith(prefix.toLowerCase())) {
      box.style.display = 'block';
      found++;
    } else {
      box.style.display = 'none';
    }
  });

}
function populateCourseFilter() {
  console.log("filtering");
  const courses = JSON.parse(sessionStorage.getItem('courses')) || [];
  const container = document.getElementById("courseFilterContainer");
  const filterSelect = document.getElementById('courseFilter');

  if (!filterSelect || !container || courses.length == 0) return;

  filterSelect.style.display = 'inline-block';
  filterSelect.innerHTML = '<option value="all">All courses</option>';
  courses.forEach(c => {
    const key = courseKey(c.title);
    const opt = document.createElement('option');
    opt.value = key;
    opt.text = c.title;
    filterSelect.appendChild(opt);
  });
}
/* 3. whenever the user switches course, hide / show boxes */
function applyCourseFilter(key) {
  
  const boxes = document.querySelectorAll('.container-box .box');
  console.log(key);
  console.log(boxes[0].classList.contains(key));
  boxes.forEach(box => {
    if (key === 'all' || box.classList.contains(key)) {

      box.style.display = 'block';
    } else {
      box.style.display = 'none';
    }
  });
}


// Esegui la funzione ogni volta che cambia l'input
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    const value = input.value.trim();
    search(value);
  });

  const courses = JSON.parse(sessionStorage.getItem('courses')) || [];
  const filterSelect = document.getElementById('courseFilter');
  if (filterSelect) {
    
    filterSelect.addEventListener('change', e => applyCourseFilter(e.target.value));
    
  }
  if (courses.length === 0) {
    var option = document.createElement('option');
    option.value = '';
    option.textContent = "No course available";
    filterSelect.style.pointerEvents = "none";
    filterSelect.appendChild(option);
  }
  populateCourseFilter();
});

function changeTag(tag) {
  if (tag == 'Arts & Design') {
    return ("art");
  }
  if (tag == 'Business & Management') {
    return ("bam");
  }
  if (tag == 'Communication & Media') {
    return ("cam");
  }
  if (tag == 'Engineering & Technology') {
    return ("engandtech");
  }
  if (tag == 'Health & Life Sciences') {
    return ("handlife");
  }
  if (tag == 'Humanities') {
    return ("human");
  }
  if (tag == 'Law & Legal Studies') {
    return ("law");
  }
  if (tag == 'Mathematical Sciences') {
    return ("math");
  }
  if (tag == 'Natural Sciences') {
    return ("natty");
  }
  if (tag == 'Social Sciences') {
    return ("social");
  }
}


function changeColor(courseTitle, tag) {
  if (tag == 'Arts & Design') {
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow = "2px 2px 5px grey";
  }
  if (tag == 'Business & Management') {
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow = "2px 2px 7px black";
  }
  if (tag == 'Communication & Media') {
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow = "2px 2px 7px grey";
  }
  if (tag == 'Engineering & Technology') {
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow = "2px 2px 7px black";
  }
  if (tag == 'Health & Life Sciences') {
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow = "2px 2px 5px grey";
  }
  if (tag == 'Humanities') {
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow = "2px 2px 7px grey";
  }
  if (tag == 'Law & Legal Studies') {
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow = "2px 2px 7px grey";
  }
  if (tag == 'Mathematical Sciences') {
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow = "2px 2px 7px black";
  }
  if (tag == 'Natural Sciences') {
    courseTitle.style.color = "darkgreen";
    courseTitle.style.textShadow = "2px 2px 7px grey";
  }
  if (tag == 'Social Sciences') {
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow = "2px 2px 7px black";
  }
}


function courseKey(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-');
}

// Fetch notes when the page loads
async function fetchNotes() {
  try {
    const response = await fetch('/getNotes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'student_id': "",
      },
    });

    if (response.status === 200) {
      const notes = await response.json();
      console.log("Notes fetched successfully:", notes);
      const carouselContent = document.getElementById('note-box');

      if (notes.length === 0) {
        return;
      }
      else {
        carouselContent.innerHTML = '';

        notes.forEach((note, index) => {
          const isActive = 'active';

          const box = document.createElement("div");
          box.className = "box";

          const h2 = document.createElement("h2");
          h2.textContent = note.title;
          box.appendChild(h2);


          const dwnd = document.createElement("h4");
          dwnd.innerHTML = `<a href="${note.file_url}" download style="text-decoration=none;">Download File </a>`;


          if (note.professor_name) {
            box.id = changeTag(note.tag);
            box.classList.add(courseKey(note.course_id));
            changeColor(h2, note.tag);
            const h3 = document.createElement("h3");
            box.appendChild(h3);
            changeColor(h3, note.tag);
            console.log("getting prof", note.professor_name);
            //box.innerHTML+= `<img width="25" height="25" src="https://img.icons8.com/ios/50/add--v1.png" onclick="addNote('${note.id}', '${this}')" alt="add--v1"/>`;
            h3.textContent = "Author: " + note.professor_name;
            h3.style.marginBottom = "10px";
            box.innerHTML += `<h4  onclick="showFile('${note.file_type}', '${note.file_url}')">View File</h4>`;
            changeColor(box.querySelectorAll('h4')[0], note.tag);
            changeColor(dwnd.querySelectorAll('a')[0], note.tag);

          }
          else {
            box.id = "note-" + index;
            h2.color = "black";
            //box.innerHTML+= `<img  src="https://img.icons8.com/ios/50/add--v1.png" onclick="addNote('${note.id}')" alt="add--v1"/>`;
            box.innerHTML += `<h4  onclick="showFile('${note.file_type}', '${note.file_url}')">View File</h4>`;
            box.querySelectorAll('h4')[0].style.color = "black";
            dwnd.querySelectorAll('a')[0].style.color = "black";
          }

          box.appendChild(dwnd);
          carouselContent.appendChild(box);


        });
      }


    }
  } catch (error) {
    console.error('Error fetching notes:', error);
  }
}
function showFile(file_type, url) {
  console.log("entering show function");
  sessionStorage.setItem("url", url);
  sessionStorage.setItem("file_type", file_type);
  window.location.href = "notes_viewer.html";
}
document.addEventListener('DOMContentLoaded', fetchNotes);

function openPopup(popup, overlay) {
  document.getElementById(popup).classList.add("popupactive");
  document.getElementById(overlay).classList.add("overlayactive");
}

function closePopup(popup, overlay) {
  document.getElementById(popup).classList.remove("popupactive");
  document.getElementById(overlay).classList.remove("overlayactive");
}

function addNote(popup, overlay) {
  document.getElementById(popup).classList.remove("popupactive");
  document.getElementById(overlay).classList.remove("overlayactive");
}

function open_Menu() {
  document.getElementById("mySidebar").style.width = "25%";
  document.getElementById("mySidebar").style.display = "block";
  document.getElementById("overlaybar").classList.add("overlayactive");
}
function close_Menu() {
  document.getElementById("openNav").style.marginLeft = "0%";
  document.getElementById("mySidebar").style.display = "none";
  document.getElementById("overlaybar").classList.remove("overlayactive");
}
function open_Profile() {
  document.getElementById("profileSidebar").style.width = "25%";
  document.getElementById("profileSidebar").style.display = "block";
  document.getElementById("overlaysidebar").classList.add("overlayactive");
}
function close_Profile() {
  document.getElementById("profileSidebar").style.display = "none";
  document.getElementById("overlaysidebar").classList.remove("overlayactive");
}

function addNote(note_id, element) {
  // va aggiunta per lo studente

}


/* 
// Request for the name of the student to user-service
async function fetchUsername() {
    const studentId = getCookie("user_Id");
    try{
        const response = await fetch('/getUsername', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: studentId, target: "getUsername" }),
        });

        if(response.status === 200) {
            const res = await response.json();
            const student = res.response
            
            console.log("Student name fetched successfully:", student);

            const welcomeMessage = document.getElementById('welcomeUser');
            if(welcomeMessage) {
                // Set the welcome message in the HTML element with ID 'welcomeUser'
                welcomeMessage.textContent = `Welcome, ${student}`;
            } else {
                console.error("Element with ID 'welcomeUser' not found.");
            }
        }
        else{
            console.error("Failed to fetch student name:", response.statusText);
        }
    } catch (error) {
        console.error('Error fetching student name:', error);
    }
}
document.addEventListener("DOMContentLoaded", fetchUsername);
 */
