const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const email = document.getElementById('email');
const fullName = document.getElementById('fname');
const password = document.getElementById('password');
const error = document.getElementById('error');
const success = document.getElementById('success');

if(localStorage.getItem('token') != null){
    window.location.href = "project.html";
}

if(registerForm != null){
    registerForm.addEventListener('submit', (event) => {
        event.preventDefault();
    
        if(!validatePassword(password.value)){
            showError("Password must be at least 6 symbols");
        }
    
        const requestBody = {
            email: email.value,
            password: password.value,
            name: fullName.value
        }
    
        postRequest("http://localhost:3000/api/register",  JSON.stringify(requestBody), 
        (data) => {
            localStorage.setItem('token', data.token);
            window.location.replace("project.html");
        }, 
        (err) => {
            showError("Invalid email or password");
        });
    });    
}

if(loginForm != null){
    loginForm.addEventListener('submit', event => {
        event.preventDefault();

        const requestBody = {
            email: email.value,
            password: password.value
        }
        
        postRequest("http://localhost:3000/api/login",  JSON.stringify(requestBody), 
            (data) => {
                localStorage.setItem('token', data.token);
                window.location.replace("project.html");
            }, 
            (err) => {
                showError("Invalid email or password");
            });
    })
}

function postRequest(url, body, successCallback, errorCallback){
    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: body
    })
    .then(resonse => resonse.json())
    .then(data => {
        successCallback(data);
    }).catch(err => {
        errorCallback(err);
    })
}

function showError(text){
    error.style.display = 'block';
    const textNode = document.createTextNode(text);
    const paragraph = document.getElementById('error-message');
    paragraph.innerHTML = "";
    paragraph.appendChild(textNode);

    setTimeout(() => {
        error.style.display = 'none';
    }, 3000)
}

function validatePassword(password){
    if(password.length < 6){
        return false;
    }

    return true;
}