const projectForm = document.getElementById('project-form');
const projectList = document.getElementById('project-list-container');
const token = localStorage.getItem('token');

if(token == null){
    window.location.href = "index.html";
}

document.getElementById('logout-list-item').addEventListener('click', (event) => {
    localStorage.removeItem('token');
    window.location.href = "index.html";
})

projectForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const data = new FormData(projectForm);

    try{
        const result = await fetch("http://localhost:3000/api/project", {
            method: "POST",
            body: data
        })
        const newProject= await result.json();
        console.log(newProject);
        addProject(newProject);

    }catch(error){
        alert("Invalid project data");
        console.error(error);
    }
});

async function displayProjects(){
    try{
        const result = await fetch("http://localhost:3000/api/project", {
                method: "GET"
            })
        const projectList = await result.json();

        projectList.forEach(element => {
            addProject(element);
        });
    }catch(err){

    }
}


function addProject(project){
    const newDiv = document.createElement("div");
    newDiv.id = 'project-list-item';

    const projectName = document.createElement("h3");
    projectName.id = "project-list-name";
    projectName.innerHTML = project.projectName;

    const projectImage = document.createElement("img");
    projectImage.alt = "Project image";
    projectImage.setAttribute('src', `data:image/${project.image.contentType};base64,${project.image.img}`);

    const editButton = document.createElement("button");
    editButton.id = "btn-edit";
    editButton.className = "btn btn-primary";
    editButton.innerHTML = "Edit";
    editButton.dataset.target = "#editModal";
    editButton.dataset.toggle = "modal";
    
    const deleteButton = document.createElement("button");
    deleteButton.id = "btn-delete";
    deleteButton.innerHTML = "Delete";
    deleteButton.className = "btn btn-danger";

    const box = document.createElement("div");
    box.id = "box"
    box.appendChild(editButton);
    box.appendChild(deleteButton);

    newDiv.appendChild(projectName);
    newDiv.appendChild(projectImage);
    newDiv.appendChild(box);
    projectList.appendChild(newDiv);
    addDeleteProjectListener(newDiv, project.id, deleteButton);
}

function addDeleteProjectListener(listElement, projectId, deleteButton){
    deleteButton.addEventListener('click',  async (event) => {
        try{
            await fetch(`http://localhost:3000/api/project/${projectId}`,
            {
                method: "DELETE"
            });
        }catch(err){

        }
        
        projectList.removeChild(listElement);
    })
}

displayProjects();
