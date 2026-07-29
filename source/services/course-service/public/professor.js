

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

async function personalData() {
  console.log("Personal data function called");
  window.location.href = getDynamicUrl(8080, '/personalData');
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
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

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
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


function openPopup(popup, overlay){
    document.getElementById(popup).classList.add("popupactive");
    document.getElementById(overlay).classList.add("overlayactive");
}

function closePopup(popup, overlay){
    document.getElementById(popup).classList.remove("popupactive");
    document.getElementById(overlay).classList.remove("overlayactive");
}

function changeTag(tag){
  if ( tag == 'Arts & Design'){
    return("art");
  }
  if ( tag == 'Business & Management'){
    return("bam");
  }
  if ( tag == 'Communication & Media'){
    return("cam");
  }
  if ( tag == 'Engineering & Technology'){
    return("engandtech");
  }
  if ( tag == 'Health & Life Sciences'){
    return("handlife");
  }
  if ( tag == 'Humanities'){
    return("human");
  }
  if ( tag == 'Law & Legal Studies'){
    return("law");
  }
  if ( tag == 'Mathematical Sciences'){
    return("math");
  }
  if ( tag == 'Natural Sciences'){
    return("natty");
  }
  if ( tag == 'Social Sciences'){
    return("social");
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



async function loadCourses() {
  const professorId = getCookie("user_Id");
    try {
      const response = await fetch('/getCourses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'professor_id': professorId  
        }
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const courses = await response.json(); // I dati ricevuti
      console.log("Corsi ricevuti:", courses);
      const container = document.getElementById('coursesContainer');
      container.innerHTML = ''; // Pulisce il contenitore
     
      courses.forEach(course => {
        const box = document.createElement('div');
        box.className = 'box';
        box.id = changeTag(course.tag);

        box.addEventListener('click', () => {
          // Crea l'URL con i parametri
          localStorage.setItem("courseId", course.id);
          localStorage.setItem("title", course.title);
          localStorage.setItem("professor", course.professor_name);
          localStorage.setItem("subject", course.tag);
          
          // Reindirizza alla pagina (senza passare parametri in URL)
          window.location.href = "/CoursePage";
        });
        const h1 = document.createElement("h1");
        changeColor(h1, course.tag);
        h1.textContent = course.title;
        box.appendChild(h1);
        container.appendChild(box);

      });
      if(container.innerHTML=='')  
        container.innerHTML = '<p style="margin-left: 30px;">There are no courses at the moment... Add one!</p>'; // Pulisce il contenitore

    } catch (error) {
      console.error('Errore nella richiesta dei corsi:', error);
    }
  }
  
  // Chiamata al caricamento della pagina
  document.addEventListener("DOMContentLoaded", loadCourses);


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
          const student1 = res.response.content;
          const student = JSON.parse(student1);
          console.log("In get Usernamr");
          console.log("Student name fetched successfully:", student);

          localStorage.setItem("professorName", student); // Store the student name in local storage
        
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

// Access the value directly when needed
async function addCourse(popupId, overlayId) {
  const professorId = getCookie("user_Id");

  const titleInput = document.getElementById('course_name');
  const descriptionInput = document.getElementById('description');
  const subjectInput = document.querySelector('#subject');
  const professorUsername= localStorage.getItem("professorName");
  console.log("the Username for prof is: "+professorUsername+ "and Id:"+professorId);
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const subject = subjectInput.value.trim(); 
  console.log("the subject is: "+subject);
  if (!title || !description || !subject) {
    alert('Please fill all the fields.');
    return;
  }

    try {
        const response = await fetch('/addCourse', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                description: description,
                professor_id: professorId,
                professor_name: professorUsername,
                tag: subject // Use the selected subject
            })
        });

        console.log('Response Status:', response.status);
        const responseData = await response.json();
        if(responseData.message.length>0) alert(responseData.message);

        // Reload courses to include the new course
        console.log('Reloading courses...');
        await loadCourses();

        // Close the popup
        closePopup(popupId, overlayId);

        // Clear input fields
        titleInput.value = '';
        descriptionInput.value = '';
        subjectInput.value = '';
    } catch (error) {
        console.error('Error adding course:', error);
    }
}
  
