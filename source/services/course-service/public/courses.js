
const container = document.getElementById("course-container");
const noResults = document.getElementById("no-results");



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

function goHome(){
  window.location.href = getDynamicUrl(7070, '/getStudentPage');
}

function goNotes(){
  window.location.href = getDynamicUrl(7070, '/getNotesPage');
}


function openPopup(popupId, overlayId) {
  document.getElementById(popupId).classList.add("popupactive");
  document.getElementById(overlayId).classList.add("overlayactive");
}

// Chiude popup principale
function closePopup(popupId, overlayId) {
  document.getElementById(popupId).classList.remove("popupactive");
  document.getElementById(overlayId).classList.remove("overlayactive");

  // Pulisce i campi
  document.getElementById('course_name').value = '';
  document.getElementById('description').value = '';
}

// Apre il popup di ricerca
function openSearchPopup() {
  document.getElementById('popup-search').classList.add("popupactive");
  document.getElementById('overlay-search').classList.add("overlayactive");

}
// Chiude il popup di ricerca
function closeSearchPopup(popupId, overlayId) {
  document.getElementById(popupId).classList.remove("popupactive");
  document.getElementById(overlayId).classList.remove("overlayactive");

  refreshCourseContainer();
  window.location.reload(); 
}

function addCourse(popup, overlay) {
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
function changeColor(courseTitle, tag,){
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

function changeColorBox(courseTitle, tag,){
  if ( tag == 'Arts & Design'){
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow= "2px 2px 5px grey";
    courseTitle.style.backgroundColor = "#f1f1f1";
  }
  if ( tag == 'Business & Management'){
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow= "2px 2px 7px black";
    courseTitle.style.backgroundColor = "#000000";

  }
  if ( tag == 'Communication & Media'){
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow= "2px 2px 7px grey";
    courseTitle.style.backgroundColor = "#f1f1f1";
  }
  if ( tag == 'Engineering & Technology'){
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow= "2px 2px 7px black";
    courseTitle.style.backgroundColor = "#0a2d63ff";
  }
  if ( tag == 'Health & Life Sciences'){
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow= "2px 2px 5px grey";
    courseTitle.style.backgroundColor = "#f1f1f1";
  }
  if ( tag == 'Humanities'){
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow= "2px 2px 7px grey";
    courseTitle.style.backgroundColor = "#855f33ff";
  }
  if ( tag == 'Law & Legal Studies'){
    courseTitle.style.color = "#000000";
    courseTitle.style.textShadow= "2px 2px 7px grey";
    courseTitle.style.backgroundColor = "#f1f1f1";
  }
  if ( tag == 'Mathematical Sciences'){
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow= "2px 2px 7px black";
    courseTitle.style.backgroundColor = "#000000";
  }
  if ( tag == 'Natural Sciences'){
    courseTitle.style.color = "darkgreen";
    courseTitle.style.textShadow= "2px 2px 7px grey";
    courseTitle.style.backgroundColor = "#f1f1f1";
  }
  if ( tag == 'Social Sciences'){
    courseTitle.style.color = "#ffffff";
    courseTitle.style.textShadow= "2px 2px 7px black";
    courseTitle.style.backgroundColor = "#000000";
  }
}


// Funzione per creare un box corso
function createCourseBox(title, category, prof_name) {
  const box = document.createElement("div");
  box.className = "box";

  const h1 = document.createElement("h1");
  changeColor(h1, category);
  h1.textContent = title;
  box.appendChild(h1);

  const h2 = document.createElement("h2");
  h2.textContent = "Prof. "+prof_name; 
  changeColorBox(h2, category);
  box.appendChild(h2);
  return box;
}



function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
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



function search(prefix) {
  const container = document.getElementById('course-container');
  const boxes = container.querySelectorAll('.box');
  const noResults = document.getElementById('no-results');
  let found = 0;

  boxes.forEach(box => {
    const text = box.textContent.toLowerCase();
    if (text.startsWith(prefix.toLowerCase())) {
      box.style.display = 'block';
      found++;
    } else {
      box.style.display = 'none';
    }
  });

  noResults.style.display = found === 0 ? 'block' : 'none';
}

// Esegui la funzione ogni volta che cambia l'input
document.addEventListener('DOMContentLoaded', () => {
  const input = document.getElementById('searchInput');
  input.addEventListener('input', () => {
    const value = input.value.trim();
    search(value);
  });
});


async function loadCourses() {
  const studentId = getCookie("user_Id");
  console.log("studentID : ", studentId);
  try {
    const response = await fetch('/getCoursesByStudentId', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'student_id': studentId,
      },

    });

    if (response.status === 200) {
      const res = await response.json();
      if (!res || res.length === 0 || res.response=="courses not found") {
        noResults.style.display = "block";
      }

      else {
        noResults.style.display = "none";
        res.forEach(course => {
          
          const box = createCourseBox(course.title, course.tag, course.professor_name|| "uncategorized");
          changeTag(box,course.tag);

          container.appendChild(box);

          box.addEventListener('click', () => {
            // Crea l'URL con i parametri
            localStorage.setItem("courseId", course.id);
            localStorage.setItem("title", course.title);
            localStorage.setItem("professor", course.professor_name);
            localStorage.setItem("subject", course.tag);
            
            // Reindirizza alla pagina (senza passare parametri in URL)
            window.location.href = "/CoursePage";
          });
        });
        
      }
    }
  }
  catch (error) {
    console.error("Error in LoadCourses", error);
  };
};
document.addEventListener("DOMContentLoaded", loadCourses);


function createResultBox(courseName, professorName, courseId, isSubscribed) {
  const resultBox = document.createElement("div");
  resultBox.classList.add("result-box");

  const courseTitle = document.createElement("h1");
  courseTitle.textContent = courseName;

  const professor = document.createElement("h2");
  professor.textContent = "Prof. " + professorName;

  const row = document.createElement("div");
  row.classList.add("title-row");

  const button = document.createElement('button');
  button.classList.add('subscribe-btn');
  button.dataset.courseId = courseId;

  console.log("courseID exists?", document.getElementById(courseId));
  // Stato iniziale del bottone
  button.textContent = isSubscribed ? 'Subscribed ✓' : 'Subscribe';
  if (isSubscribed) button.classList.add('subscribed');
  

  button.addEventListener('click', async () => {
    const studentId = getCookie('user_Id');
    const currentlySubscribed = button.classList.contains('subscribed');
    const endpoint = currentlySubscribed ? '/unsubscribeFromCourse' : '/subscribeToCourse';
    console.log("Invio richiesta per:", endpoint); // Debug
  
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          course_id: courseId
        })
      });
  
      if (!res.ok) {
        const errorText = await res.text();
        console.error(`Errore nella risposta: ${errorText}`);
      }
  
      if (res.ok) {
        console.log("Corso aggiornato con successo."); // Debug
        // Cambia il testo e lo stile del bottone
        if (currentlySubscribed) {
          button.textContent = 'Subscribe';
          button.classList.remove('subscribed');
        } else {
          button.textContent = 'Subscribed ✓';
          button.classList.add('subscribed');
        }
  
        // Aggiorna la lista dei corsi iscritti nel container
        await refreshCourseContainer();  // Ricarica il contenitore dei corsi dopo l'azione
      }
    } catch (err) {
      console.error("Errore nella fetch:", err);
    }
  });

  row.appendChild(courseTitle);
  row.appendChild(button);
  resultBox.appendChild(row);
  resultBox.appendChild(professor);

  return resultBox;
}
 
document.getElementById("add").addEventListener("click", searchCourses);

async function searchCourses() {
  const professor = document.getElementById("description").value.trim();
  const course = document.getElementById("course_name").value.trim();
  const studentId = getCookie('user_Id');
  console.log(studentId);
  const resultsContainer = document.getElementById("search-results");
  resultsContainer.innerHTML = "";

  if (!professor && !course) {
    console.warn("Inserisci almeno il nome del professore o del corso.");
    return;
  }

  try {
    const response = await fetch('/getCoursesBySearch', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'professor_name': professor,
        'course_name': course,
        'student_id': studentId
      }
    });

    if (response.status === 200) {
      const res = await response.json();
      console.log("Corsi trovati:", res);

      if (res.length === 0) {
        resultsContainer.innerHTML = "<p>Oopss... no course has been found.</p>";
      } else {
        res.forEach(course => {
          const box = createResultBox(course.title, course.professor_name, course.id, course.isSubscribed);
          changeTag(box, course.tag);
          resultsContainer.appendChild(box);
        });
      }

      
      
      openSearchPopup();

    } else {
      console.error("Errore nella richiesta:", response.status);
    }

  } catch (error) {
    console.error("Errore nella fetch:", error);
  }
}

async function refreshCourseContainer() {
  const studentId = getCookie("user_Id");
  const container = document.getElementById("course-container");

  // Pulizia contenitore
  container.innerHTML = "";

  // Ricrea manualmente il <p id="no-results">
  const noResults = document.createElement("p");
  noResults.id = "no-results";
  noResults.textContent = "Oopss...No course has been found";
  noResults.style.display = "none"; // lo nascondi finché non serve
  container.appendChild(noResults);

  try {
    const response = await fetch('/getCoursesByStudentId', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'student_id': studentId,
      },
    });

    if (response.ok) {
      const courses = await response.json();

      if (!courses || courses.length === 0) {
        noResults.style.display = "block";
      } else {
        noResults.style.display = "none";
        courses.forEach(course => {
          const box = createCourseBox(course.title, course.tag ,course.professor_name || "uncategorized");
          changeTag(box,course.tag);
          container.appendChild(box);
        });
        
      }
    } else {
      console.error("Errore nel caricamento dei corsi iscritti.");
    }
  } catch (error) {
    console.error("Errore aggiornando i corsi iscritti:", error);
  }
}



/* // Request for the name of the student to user-service
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
          const student = res.response;
          
           console.log("Student name fetched successfully:", student);

          const welcomeMessage = document.getElementById('welcomeUser');
          if(welcomeMessage) {
            console.log(`Welcome, `+student);
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