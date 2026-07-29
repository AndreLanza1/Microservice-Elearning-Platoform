

// Menu functionality
function openPopup(popup, overlay){
    document.getElementById(popup).classList.add("popupactive");
    document.getElementById(overlay).classList.add("overlayactive");
}

function closePopup(popup, overlay){
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

// Add event listeners
document.getElementById("openNav").addEventListener("click", open_Menu);
document.getElementById("profile").addEventListener("click", open_Profile);
document.getElementById("overlaybar").addEventListener("click", close_Menu);
document.getElementById("overlaysidebar").addEventListener("click", close_Profile);

//To change the profile image based on the role
const role = sessionStorage.getItem("userRole");
const profileImage = document.getElementById("profileImage");

if (role == "student") {
    profileImage.src = "student.png";
} else if (role == "teacher") {
    profileImage.src = "Professor.png";
} 

function getCookie(name) {
const value = `; ${document.cookie}`;
const parts = value.split(`; ${name}=`);
if (parts.length === 2) return parts.pop().split(';').shift();
}

async function fetchUserData() {
    const userId = getCookie("user_Id");
    console.log("User ID from cookie:", userId);
    try {
        const response = await fetch('/userData', {
            method: 'GET',
            headers:{
                'Content-Type': 'application/json',
                'user_id': userId,
            },
        });
        if (response.status === 200) {
            const userData = await response.json();
            console.log("User data fetched successfully:", userData);
            const dataContainer = document.getElementById('personalInfo');
            dataContainer.innerHTML = ''; // Clear previous content

            const userInfoHtml = `
                <div class="info-item">
                    <div class="info-label">Username:</div>
                    <div class="info-value">${userData.username}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Email:</div>
                    <div class="info-value">${userData.email}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Role:</div>
                    <div class="info-value">${userData.role}</div>
                </div>
            `;
            dataContainer.innerHTML = userInfoHtml;

        } else {
            console.error('Failed to fetch user data:', response.statusText);
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
    }
}
document.addEventListener('DOMContentLoaded', fetchUserData);

document.addEventListener("DOMContentLoaded", function() {
    const role = sessionStorage.getItem("userRole");
    const menuItems = document.getElementById("menuItems");

    if (role === "student") {
        menuItems.innerHTML = `
        <p><a href="javascript:void(0)" onclick="navigateTo(7070, '/home')"><i class="fa-solid fa-house-user"></i> Home</a></p>
        <p><a href="javascript:void(0)" onclick="navigateTo(6060, '/CoursesPage')"><i class="fa-solid fa-chalkboard"></i> Courses</a></p>
        <p><a href="javascript:void(0)" onclick="navigateTo(7070, '/my_notes')"><i class="fa-solid fa-file-pen"></i> My Notes</a></p>
        <p><a href="javascript:void(0)" onclick="navigateTo(7070, '/all_notes')"><img width="40" height="40" src="https://img.icons8.com/ios-filled/50/search-in-browser.png"/> All Notes</a></p>
        `;
   } else if (role === "teacher") {
        menuItems.innerHTML = `
          <p><a href="javascript:void(0)" onclick="navigateTo(6060, '/home')"><i class="fa-solid fa-house-user"></i> Courses</a></p>
        `;
    }
});
