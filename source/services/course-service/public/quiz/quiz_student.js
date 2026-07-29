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


let quizzes = [];
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
            quizzes = await response.json();
            console.log("Quizzes fetched successfully:", quizzes);
            renderQuizzes(quizzes); // Call the function to render quizzes
        }
    } catch (error) {
        console.error('Error fetching quizzes:', error);
    }
}

// Function for tab 
function changeTag(box, tag) {
    if (tag == 'Arts & Design') {
        box.classList.add("art");
    }
    if (tag == 'Business & Management') {
        box.classList.add("bam");
    }
    if (tag == 'Communication & Media') {
        box.classList.add("cam");
    }
    if (tag == 'Engineering & Technology') {
        box.classList.add("engandtech");
    }
    if (tag == 'Health & Life Sciences') {
        box.classList.add("handlife");
    }
    if (tag == 'Humanities') {
        box.classList.add("human");
    }
    if (tag == 'Law & Legal Studies') {
        box.classList.add("law");
    }
    if (tag == 'Mathematical Sciences') {
        box.classList.add("math");
    }
    if (tag == 'Natural Sciences') {
        box.classList.add("natty");
    }
    if (tag == 'Social Sciences') {
        box.classList.add("social");
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
        const students = await fetch('/getUsernames', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            body: JSON.stringify({ id: studentIds, target: "getUsernames" }),
        });

        if (students.status === 200) {
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
                else {
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
        else {
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
    console.log("Course title:", title, "Subject:", subject);
    const courseTitle = document.getElementById('courseTitle');
    const tagTitle = document.getElementById('titlebox');
    if (courseTitle && tagTitle) {
        courseTitle.textContent = title;
        changeColor(courseTitle, subject);
        changeTag(tagTitle, subject);
    }
}
async function viewAllCourses() {
    window.location.href = getDynamicUrl(6060, '/CoursePage');
}

async function openStudents() {
    let studIds = [];
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


    // Show students, hide quizzes
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


async function isCompleted(quizId) {
    const currentUserId = getCookie("user_Id");
    console.log("Current user ID:", currentUserId);
    try {
        const response = await fetch(`/getQuizAnswer?studentId=${currentUserId}&quizId=${quizId}`);

        if (response.status === 200) {
            const data = await response.json();
            if (data == null) {
                return { quiz_completed: false, score: null };
            }
            else {
                return { quiz_completed: true, score: data.score };
            }
        }
    } catch (error) {
        console.error("Error fetching quiz completion status:", error);
        return false;
    }
}


// Function to render quizzes
async function renderQuizzes(quizzes) {
    console.log("Rendering quizzes:", quizzes);
    console.log("Quizzes is of type:", typeof quizzes);
    const quizzesContainer = document.getElementById('quizzes-list');
    quizzesContainer.innerHTML = '';

    if (quizzes === null || quizzes.length === 0) {
        quizzesContainer.innerHTML = '<p>No quizzes available.</p>';
        return;
    }
    else {

        for (const quiz of quizzes) {
            const quizCard = document.createElement('div');
            quizCard.classList.add('quiz-card');

            const { quiz_completed, score } = await isCompleted(quiz.id);

            let quizContent = `
            <h2 class="quiz-title">
                ${quiz.title}
                ${quiz.completed ? '<span class="completed-badge">Completed</span>' : ''}
            </h2>
            <p class="quiz-description">${quiz.description}</p>
        `;

            console.log("Quiz ID and completed:", quiz.id, quiz_completed);

            // Add button or results based on completion status
            if (!quiz_completed) {
                quizContent += `
                <button class="take-quiz-btn" onclick="openQuizPopup('${quiz.id}')">
                    <i class="fa-solid fa-play"></i> Take Quiz
                </button>
            `;
            } else {
                console.log("Quiz ID:", quiz.id);
                const resultsHTML = await renderQuizResults(quiz);
                quizContent += `
                <div class="result-container" style="display: block;">
                    <div class="result-header">
                        <div class="result-score">
                            Your score: <span class="score-percentage ${getScoreClass(score)}">${score}%</span>
                        </div>
                        <button class="view-results-btn" onclick="toggleResults('${quiz.id}')">
                            <i class="fa-solid fa-eye"></i> View Details
                        </button>
                    </div>
                    <div id="result-details-${quiz.id}" style="display: none;">
                        ${resultsHTML}
                    </div>
                </div>
            `;
            }

            quizCard.innerHTML = quizContent;
            quizzesContainer.appendChild(quizCard);
        };
    }

}


// Popup functionality
function openQuizPopup(quizId) {

    currentQuizId = quizId;
    const quiz = quizzes.find(q => q.id === quizId);
    console.log("Quiz ID:", quizId);
    if (!quiz) return;

    document.getElementById("popup-quiz-title").textContent = quiz.title;
    document.getElementById("popup-quiz-description").textContent = quiz.description;

    // Update progress bar
    document.getElementById("quiz-progress").style.width = "0%";

    // Clear previous questions
    document.getElementById("questions-container").innerHTML = '';

    // Add questions
    quiz.questions.forEach((question, qIndex) => {
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('quiz-question');

        let optionsHTML = '';
        question.options.forEach((option, oIndex) => {
            optionsHTML += `
                <div class="option-item">
                    <input type="radio" id="q${qIndex}-${oIndex}" name="q${qIndex}" value="${oIndex}">
                    <label for="q${qIndex}-${oIndex}">${option.text}</label>
                </div>
            `;
        });

        questionDiv.innerHTML = `
            <h3>${qIndex + 1}. ${question.text}</h3>
            <div class="options-list">
                ${optionsHTML}
            </div>
        `;

        document.getElementById('questions-container').appendChild(questionDiv);
    });

    // Display popup
    document.getElementById("quiz-overlay").classList.add("active");
    document.getElementById("quiz-popup").classList.add("active");
    document.body.classList.add('no-scroll');
}

function closeQuizPopup() {
    document.getElementById("quiz-overlay").classList.remove("active");
    document.getElementById("quiz-popup").classList.remove("active");
    document.body.classList.remove('no-scroll');
    currentQuizId = null;
}


// Function to submit quiz
async function submitQuiz(event) {
    event.preventDefault();

    if (!currentQuizId) return;
    const quiz = quizzes.find(q => q.id === currentQuizId);
    if (!quiz) return;

    // Collect user answers
    const userAnswers = [];
    let correctAnswers = 0;
    
    quiz.questions.forEach((question, qIndex) => {
        const selectedOption = document.querySelector(`input[name="q${qIndex}"]:checked`);

        if (selectedOption) {
            atLeastOneAnswered = true;
            const answerIndex = parseInt(selectedOption.value);
            userAnswers.push(answerIndex);

            if (question.options[answerIndex].correct) {
                correctAnswers++;
            }
        } else {
            userAnswers.push(null); // No answer provided
        }
    });
 
    if (userAnswers.includes(null)) {
        const errorText = "Please answer all questions before submitting the quiz.";
        showErrorPopup(errorText);
        return;
    }
    
    // Calculate score
    const score = Math.round((correctAnswers / quiz.questions.length) * 100);

    const data = {
        student_id: getCookie("user_Id"),
        quiz_id: currentQuizId,
        answers: userAnswers,
        completed: true,
        score: score
    };

    console.log("Quiz data to be sent:", data);

    try {
        const response = await fetch("/addQuizAnswer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.status === 200) {
            const result = await response.json();
            console.log("Quiz added successfully:", result);
            closeQuizPopup();
            renderQuizzes(quizzes);
        } else {
            console.error("Failed to add quiz:", response.statusText);
        }
    } catch (error) {
        console.error("Error adding quiz:", error);
    }

}



// Function to get score class based on percentage
function getScoreClass(score) {
    if (score >= 80) return 'high-score';
    if (score >= 60) return 'medium-score';
    return 'low-score';
}

// Function to toggle result details visibility
function toggleResults(quizId) {
    console.log("Toggling results for quiz ID:", quizId);
    const detailsElement = document.getElementById(`result-details-${quizId}`);
    if (detailsElement.style.display === 'none') {
        detailsElement.style.display = 'block';
    } else {
        detailsElement.style.display = 'none';
    }
}

// Function to render quiz results
async function renderQuizResults(quiz) {
    let resultsHTML = '';

    let userAnswers = [];
    const currentUserId = getCookie("user_Id");
    console.log("Current user ID:", currentUserId);
    try {
        const response = await fetch(`/getQuizAnswer?studentId=${currentUserId}&quizId=${quiz.id}`);

        if (response.status === 200) {
            const data = await response.json();
            userAnswers = data.answers;
            console.log("User answers fetched successfully:", data);
        } else {
            console.error("Failed to fetch student answers");
        }
    } catch (error) {
        console.error("Error fetching quiz answers:", error);
    }
    console.log("User answers:", userAnswers);
    quiz.questions.forEach((question, qIndex) => {

        const userAnswer = userAnswers[qIndex];

        const userOption = question.options[userAnswer];

        // Find correct answer
        const correctOption = question.options.find(opt => opt.correct);
        const correctIndex = question.options.findIndex(opt => opt.correct);

        let optionsHTML = '';
        question.options.forEach((option, oIndex) => {
            let classes = [];
            let label = null;

            // User's answer
            if (oIndex === userAnswer) {
                classes.push('your-answer');
                label = 'Your Answer';
            }

            // Correct answer
            if (option.correct) {
                classes.push('correct-answer');
                if (label !== 'Your Answer') {
                    label = 'Correct Answer';
                }
            }

            // Wrong answer (user selected incorrect option)
            if (oIndex === userAnswer && !option.correct) {
                classes.push('wrong-answer');
            }

            if (classes.length > 0) {
                optionsHTML += `
                    <div class="answer-option ${classes.join(' ')}">
                        ${option.text}
                        ${label ? `<span class="answer-label ${label === 'Your Answer' && !option.correct ? 'your-answer-label' : 'correct-answer-label'}">${label}</span>` : ''}
                    </div>
                `;
            }
        });

        resultsHTML += `
            <div class="question-result">
                <div class="question-text">${qIndex + 1}. ${question.text}</div>
                ${optionsHTML}
            </div>
        `;
    });

    return resultsHTML;
}



// Add event listeners

document.addEventListener('DOMContentLoaded', getQuizzes);
document.addEventListener('DOMContentLoaded', function () {

    // To add the course details to the page
    populateCourseDetails();
    const { courseId } = getQueryParams();
    if (courseId) fetchStudents(courseId);


    // Quiz popup listeners
    document.getElementById("close-popup").addEventListener("click", closeQuizPopup);
    document.getElementById("cancel-btn").addEventListener("click", closeQuizPopup);
    document.getElementById("quiz-overlay").addEventListener("click", function (e) {
        if (e.target === this) {
            closeQuizPopup();
        }
    });

    // Quiz form submission
    document.getElementById("quiz-form").addEventListener("submit", function (event) {
        event.preventDefault();
        submitQuiz(event);
    });


    // Add progress tracking for quiz questions
    document.addEventListener('change', function (e) {
        if (e.target && e.target.type === 'radio' && e.target.name.startsWith('q')) {
            updateQuizProgress();
        }
    });

});

// Function to update quiz progress bar
function updateQuizProgress() {
    if (!currentQuizId) return;

    const quiz = quizzes.find(q => q.id === currentQuizId);
    if (!quiz) return;

    let answeredCount = 0;
    quiz.questions.forEach((_, qIndex) => {
        const selectedOption = document.querySelector(`input[name="q${qIndex}"]:checked`);
        if (selectedOption) {
            answeredCount++;
        }
    });

    const progressPercentage = (answeredCount / quiz.questions.length) * 100;
    document.getElementById("quiz-progress").style.width = `${progressPercentage}%`;
}