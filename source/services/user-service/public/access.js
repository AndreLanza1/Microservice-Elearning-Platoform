function redirectToIndex() {
    window.location.href = "/index";
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

document.addEventListener("DOMContentLoaded", function () {

    const container = document.getElementById('container');
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
 
    // Show the sign-up form when the "Sign Up" button is clicked
    registerBtn.addEventListener('click', () => {
        container.classList.add("active");
    });

    // Show the login form when the "Login" button is clicked
    loginBtn.addEventListener('click', () => {
        container.classList.remove("active");
    });

    // Redirects the user to the sign-up page with the specified role as a query parameter
    const role = sessionStorage.getItem("userRole");
    if (role) {
        console.log("Role from session storage:", role);
        document.getElementById("roleTitle").innerText = `Hello,`+` ${role.charAt(0).toUpperCase() + role.slice(1)}`;
        
        // Add a hidden input field to the form with the role value
        let input = document.createElement("input");
        input.type = "hidden";
        input.name = "role";
        input.value = role;
        document.querySelector(".form-container.sign-up form").appendChild(input);
    }
    else{
        console.log("No role found in session storage.");
    
    }

    // POST request for login 
    const loginForm = document.getElementById("login-form");
    if(loginForm){
        console.log("loginForm",loginForm);
        loginForm.addEventListener("submit", async (event)=> {
            event.preventDefault(); // Prevent the default form submission

            const email = document.getElementById("login-email").value;
            const password = document.getElementById("login-password").value;
            const role = sessionStorage.getItem("userRole");
            
            const data = {
                email: email,
                password: password,
                role: role,
            };

            try {
                const response = await fetch("/login", {
                    method: "POST",
                    // credentials: "include", // Include cookies in the request
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                });
                

                if (response.status === 200) {
                    const result = await response.json();

                    console.log("Login successful:", result);
                    console.log("Cookies: ",document.cookie);

                    const currentHost = window.location.hostname;
                    let studentServiceUrl = "http://localhost:7070";
                    let courseServiceUrl = "http://localhost:6060";

                    // Se l'host non è localhost, calcola dinamicamente l'URL
                    if (currentHost.includes('github.dev') || currentHost.includes('gitpod.io')) {
                        // Sostituiamo semplicemente il pezzo di stringa con la porta corretta
                        studentServiceUrl = window.location.protocol + "//" + currentHost.replace('8080', '7070');
                        courseServiceUrl = window.location.protocol + "//" + currentHost.replace('8080', '6060');
                    }
                    //if role is student
                    if(sessionStorage.getItem("userRole") === "student"){
                        // Redirect to the home page of the student-service passandogli il token!
                        window.location.href = studentServiceUrl + "/home?token=" + result.token;
                    }
                    //if role is teacher
                    else if(sessionStorage.getItem("userRole") === "teacher"){
                        // Redirect to the home page of the teacher passandogli il token!
                        window.location.href = courseServiceUrl + "/home?token=" + result.token;
                    }
                } else {
                    const errorText = await response.json();
                    console.error("Login failed:", errorText);
                    showErrorPopup(errorText.message);
                }
            } catch (error) {
                console.error("Error during login:", error);
                alert(errorText);
            }

            


        });
    }
});