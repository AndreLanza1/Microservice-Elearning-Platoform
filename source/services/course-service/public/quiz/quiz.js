
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Funzione per calcolare dinamicamente l'URL (Locale o GitHub Codespaces)
function getDynamicUrl(port, path) {
    const currentHost = window.location.hostname;
    if (currentHost.includes('github.dev')) {
        const newHost = currentHost.replace(/-\d+\.app\.github\.dev/, '-' + port + '.app.github.dev');
        return window.location.protocol + "//" + newHost + path;
    }
    return "http://localhost:" + port + path;
}

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

async function viewAllCourses() {
    window.location.href = getDynamicUrl(6060, '/CoursePage');
}

//Toast
function showErrorPopup(message) { showToast(message, "error"); }
function showSuccessPopup(message) { showToast(message, "success"); }

function showToast(message, type) {
      const toast = document.createElement("div");
      toast.textContent = message;
      toast.className = "toast " + type;
      document.body.appendChild(toast);

      setTimeout(() => toast.classList.add("show"), 100);
      setTimeout(() => {
          toast.classList.remove("show");
          setTimeout(() => toast.remove(), 300);
      }, 3000);
}

async function getQuizzes() {

    
    try {
        const response = await fetch('/getQuizzes', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'course_id': localStorage.getItem("courseId"),
            },
        });
        if (response.status === 200) {
            const quizzes = await response.json();
            console.log("Quizzes fetched successfully:", quizzes);
            renderQuizzes(quizzes); // Call the function to render quizzes
        }
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}


// Function for tab 
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


// Student list
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
        console.log("Usernames is not an array:", usernames);
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
  const quizContainer = document.getElementById('main-container');
  const studentsBox = document.getElementById('students-box');
  const label = document.getElementById('stud_annou');
  
    // Mostra studenti, nasconde quiz
    quizContainer.style.display = 'none';
    studentsBox.style.display = 'block';
  
}

// Menu functionality
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

// Popup functionality
function openQuizPopup() {
    document.getElementById("quiz-overlay").classList.add("active");
    document.getElementById("quiz-popup").classList.add("active");
    document.body.classList.add('no-scroll');
}

function closeQuizPopup() {
    document.getElementById("quiz-overlay").classList.remove("active");
    document.getElementById("quiz-popup").classList.remove("active");
    // Reset form
    document.getElementById("quiz-form").reset();
    document.getElementById("questions-container").innerHTML = "";
    document.body.classList.remove('no-scroll');
}

// Function to add a new question form
function addQuestionForm() {
    const questionIndex = document.querySelectorAll('.question-form').length;
    
    const questionForm = document.createElement('div');
    questionForm.classList.add('question-form');
    questionForm.innerHTML = `
        <div class="form-group">
            <label for="question-${questionIndex}">Question ${questionIndex + 1}</label>
            
            <input type="text" id="question-${questionIndex}" placeholder="Enter your question" required>
            
        </div>
        
        <div class="options-container" id="options-container-${questionIndex}">
            <div class="option-form" style="display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="correct-${questionIndex}" checked>
                <input type="text" placeholder="Option 1" required>
                <button type="button" class="remove-btn" onclick="removeOption(this)">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
            <div class="option-form" style="display: flex; align-items: center; gap: 10px;">
                <input type="radio" name="correct-${questionIndex}">
                <input type="text" placeholder="Option 2" required>
                <button type="button" class="remove-btn" onclick="removeOption(this)">
                    <i class="fa-solid fa-times"></i>
                </button>
            </div>
        </div>
        
        <div style="display: flex; justify-content: space-between; width: 100%;">
        <button type="button" class="add-option-btn" onclick="addOption(${questionIndex})">
            <i class="fa-solid fa-plus"></i> Add Option
        </button>
        <button type="button" class="remove-question-btn" onclick="removeQuestion(this)">
            <i class="fa-solid fa-trash"></i> Remove Question
        </button>
    </div>
    `;
    
    document.getElementById('questions-container').appendChild(questionForm);
}

// Function to add a new option to a question
function addOption(questionIndex) {
    const optionsContainer = document.getElementById(`options-container-${questionIndex}`);
    const optionCount = optionsContainer.children.length;
    
    const optionForm = document.createElement('div');
    optionForm.classList.add('option-form');
    optionForm.style.display = 'flex';
    optionForm.style.alignItems = 'center';
    optionForm.style.gap = '10px';
    optionForm.innerHTML = `
        <input type="radio" name="correct-${questionIndex}">
        <input type="text" placeholder="Option ${optionCount + 1}" required>
        <button type="button" class="remove-btn" onclick="removeOption(this)">
            <i class="fa-solid fa-times"></i>
        </button>
    `;
    
    optionsContainer.appendChild(optionForm);
}

// Function to remove an option
function removeOption(button) {
    const optionForm = button.parentElement;
    const optionsContainer = optionForm.parentElement;
    
    // Only remove if there are more than 2 options
    if (optionsContainer.children.length > 2) {
        optionsContainer.removeChild(optionForm);
    } else {
        const errorText = "Each question must have at least 2 options";
        showErrorPopup(errorText);
        return;
    }
}

// Function to remove a question
function removeQuestion(button) {
    const questionForm = button.closest('.question-form');

    if (document.querySelectorAll('.question-form').length > 1) {
        document.getElementById('questions-container').removeChild(questionForm);
    }
    else{
        const errorText = "At least one question is required.";
        showErrorPopup(errorText);
    }
}

// Function to render quizzes
function renderQuizzes(quizzes) {
    console.log("Rendering quizzes:", quizzes);
    console.log("Quizzes is of type:", typeof quizzes);
    const quizzesContainer = document.getElementById('quizzes-list');
    quizzesContainer.innerHTML = '';

    if(quizzes === null || quizzes.length === 0) {
        quizzesContainer.innerHTML = '<p>No quizzes available.</p>';
        return;
    }
    else{
        quizzes.forEach(quiz => {
            const quizCard = document.createElement('div');
            quizCard.classList.add('quiz-card');
            
            let questionsHTML = '';
            quiz.questions.forEach((question, qIndex) => {
                let optionsHTML = '';
                question.options.forEach((option, oIndex) => {
                    optionsHTML += `
                        <div class="option ${option.correct ? 'correct' : ''}">
                            <input type="radio" id="q${quiz.id}-${qIndex}-${oIndex}" name="q${quiz.id}-${qIndex}" ${option.correct ? 'checked' : ''} disabled>
                            <label for="q${quiz.id}-${qIndex}-${oIndex}" class="option-text">${option.text}</label>
                        </div>
                    `;
                });
                
                questionsHTML += `
                    <div class="question-card">
                        <div class="question-text">${qIndex + 1}. ${question.text}</div>
                        <div class="options-container">
                            ${optionsHTML}
                        </div>
                    </div>
                `;
            });
            
            quizCard.innerHTML = `
                <h2 class="quiz-title">${quiz.title}</h2>
                <p class="quiz-description">${quiz.description}</p>
                ${questionsHTML}
                <div class="quiz-actions">
                </div>
            `;
            
            quizzesContainer.appendChild(quizCard);
        });
    }
}



//Handle form submission
document.getElementById('quiz-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const title = document.getElementById('quiz-title').value;
    const description = document.getElementById('quiz-description').value;
    
    const questions = [];
    const questionForms = document.querySelectorAll('.question-form');
    const courseId = getQueryParams().courseId;
    console.log("Course ID:", courseId);

    questionForms.forEach((qForm, qIndex) => {
        const questionText = qForm.querySelector(`#question-${qIndex}`).value;
        const options = [];
        
        const optionForms = qForm.querySelectorAll('.option-form');
        optionForms.forEach((oForm) => {
            const optionText = oForm.querySelector('input[type="text"]').value;
            const isCorrect = oForm.querySelector('input[type="radio"]').checked;
            
            options.push({
                text: optionText,
                correct: isCorrect
            });
        });
        
        questions.push({
            text: questionText,
            options: options
        });
    });
    // Create new quiz or update existing
    const data = {
        course_id: courseId,
        title,
        description,
        questions
    };
    console.log("Quiz data to be sent:", data);
    try {
        const response = await fetch("/addQuiz", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            const result = await response.json();
            console.log("Quiz added successfully:", result);
            getQuizzes();
            closeQuizPopup();
        } else {
            console.error("Failed to add quiz:", response.statusText);
        }
    } catch (error) {
        console.error("Error adding quiz:", error);
    }

    
    
});

document.addEventListener('DOMContentLoaded', getQuizzes);

// Add event listeners
document.addEventListener('DOMContentLoaded', function() {

    // To add the course details to the page
    populateCourseDetails();
    const { courseId } = getQueryParams();
    if (courseId) fetchStudents(courseId); 
    
    // Quiz popup listeners
    document.getElementById("new-quiz-btn").addEventListener("click", function() {
        // Reset form and open popup
        document.getElementById("quiz-form").reset();
        document.getElementById("questions-container").innerHTML = "";
        addQuestionForm(); // Add an initial empty question
        openQuizPopup();
    });
    
    document.getElementById("close-popup").addEventListener("click", closeQuizPopup);
    document.getElementById("cancel-btn").addEventListener("click", closeQuizPopup);
    document.getElementById("quiz-overlay").addEventListener("click", function(e) {
        if (e.target === this) {
            closeQuizPopup();
        }
    });
    
    document.getElementById("add-question-btn").addEventListener("click", addQuestionForm);
    
});