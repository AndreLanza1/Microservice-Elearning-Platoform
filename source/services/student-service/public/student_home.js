

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


// Fetch notes when the page loads
async function fetchNotes() {

    const studentId = getCookie("user_Id");
    try {
        const response = await fetch('/getNotes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'student_id': studentId,
            },
        });

        if(response.status === 200) {
            const notes = await response.json();
            console.log("Notes fetched successfully:", notes);
            const carouselContent = document.getElementById('note-box');
            if (notes.length === 0) {
                carouselContent.innerHTML='<p> Ops...No note has been found</p>';
            } else {
                carouselContent.innerHTML = '';
                 
                notes.forEach((note, index) => {
                    const isActive =  'active' ;
                    const box = document.createElement("div");
                      box.className = "box";                      

                      const h2 = document.createElement("h2");
                      h2.textContent = note.title;
                      box.appendChild(h2);
                      

                      const dwnd = document.createElement("h4");
                      dwnd.innerHTML= `<a href="${note.file_url}" download style="text-decoration=none;">Download File </a>`;
                      

                      if(note.course_id){
                        box.id=changeTag(note.tag);
                        changeColor(h2, note.tag);
                        const h3 = document.createElement("h3");
                        box.appendChild(h3);
                        changeColor(h3, note.tag);
                        console.log("getting prof",note.professor_name);
                        h3.textContent = "";
                        
                        box.innerHTML+= `<h4  onclick="showFile('${note.file_type}', '${note.file_url}')">View File</h4>`;
                        changeColor(box.querySelectorAll('h4')[0], note.tag);
                        
                        changeColor(dwnd.querySelectorAll('a')[0], note.tag);

                    }
                      else  {
                        box.id="note-"+index;
                        h2.color= "black";

                        box.innerHTML+= `<h4  onclick="showFile('${note.file_type}', '${note.file_url}')">View File</h4>`;
                        box.querySelectorAll('h4')[0].style.color= "black";
                 
                        dwnd.querySelectorAll('a')[0].style.color= "black";
                    }
                    
                    box.appendChild(dwnd);
                      carouselContent.appendChild(box); 
                });
            }

            
        }
    }catch (error) {
        console.error('Error fetching notes:', error);
    }
}
document.addEventListener('DOMContentLoaded', fetchNotes);
function showFile(file_type,url){
    console.log("entering show function");
    sessionStorage.setItem("url",url);
    sessionStorage.setItem("file_type", file_type);
    window.location.href = "notes_viewer.html";    
}
async function deleteNote(noteId){
    const note_id= noteId;
    console.log("Note id"+note_id);
    try {
        const response = await fetch('/deleteNote', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'note_id': note_id
            },
        });

        if(response.status === 200) {
            const res = await response.json();
            console.log("Note deleted successfully:", res);
            fetchNotes();
        }
    }catch (error) {
        console.error('Error fetching notes:', error);
    }
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
    document.getElementById("profileSidebar").style.display = "none";
    document.getElementById("overlaysidebar").classList.remove("overlayactive");
}



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
            sessionStorage.setItem("username",student);
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
  
async function fetchCourses() {
    const studentId = getCookie("user_Id");
    try{

        const response = await fetch('/getCourses', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id: studentId, target: "getCourses" }),
        });

        if(response.status === 200) {
            const res = await response.json();
            const courses = res.response;
            
            console.log("Courses fetched successfully:", courses);

             const carouselContent = document.getElementById('course-box');
             carouselContent.innerHTML = '';
             if (courses.length === 0) {
                console.log("error");
                 carouselContent.innerHTML = '<p> Ops...No course has been found</p>';
                 return;
             }
             else if(courses == "courses not found"){
                console.log("courses not found");
                carouselContent.innerHTML = '<p> Ops...No course has been found</p>';
                return;
            }
             let count=0;
             const message=[];
             courses.forEach((course, index) => {
                 const tag= changeTag(course.tag);
                 const box = document.createElement("div");
                box.className = "box";
                box.id=tag;
                if(index==0) box.classList.add('active');

                const h2 = document.createElement("h2");
                changeColor(h2, course.tag);
                h2.textContent = course.title;
                box.appendChild(h2);

                const h3 = document.createElement("h3");
                box.appendChild(h3);
                changeColor(h3, course.tag);
                h3.textContent = "Prof. "+course.professor_name;

                 carouselContent.appendChild(box);
                 count+=1;
                 const data={
                    title: course.title,
                    tag: course.tag,
                    prof: course.professor_name
                 }
                 console.log(course.professor_name);
                 message.push(data);
             });
             
             sessionStorage.setItem("courses", JSON.stringify(message));
        }
        else{
            console.error("Failed to fetch courses:", response.statusText);
        }
    }catch (error) {
        console.error('Error fetching courses :', error);
    }
}
document.addEventListener("DOMContentLoaded", fetchCourses);

async function viewAllNotes(){
    //redirect to my_note
    window.location.href = '/my_notes';
}

async function viewAllCourses(){
    window.location.href = getDynamicUrl(6060, '/CoursesPage');
}

