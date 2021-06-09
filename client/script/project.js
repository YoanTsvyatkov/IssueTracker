const projectForm = document.getElementById('project-form');
const projectList = document.getElementById('project-list-container');

const projectEditForm = document.getElementById('edit-project');
console.log(projectEditForm);




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
        alert("Something went wrong");
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

    const issueButton = document.createElement("button");
    issueButton.id = "btn-issue";
    issueButton.innerHTML = "Issue";

    

    const box = document.createElement("div");
    box.id = "box"
    box.appendChild(editButton);
    box.appendChild(deleteButton);
    box.appendChild(issueButton);

    newDiv.appendChild(projectName);
    newDiv.appendChild(projectImage);
    newDiv.appendChild(box);
    projectList.appendChild(newDiv);
    addDeleteProjectListener(newDiv, project.id, deleteButton);
    addEditProjectListener(newDiv, project.id, editButton);
    

}


function addDeleteProjectListener(listElement, projectId, deleteButton){
    deleteButton.addEventListener('click',  async (event) => {
        try{
            await fetch(`http://localhost:3000/api/project/${projectId}`,
            {
                method: "DELETE"
            });
        }catch(err){
            alert("Something went wrong");
        }
        
        projectList.removeChild(listElement);
    })
}



function addEditProjectListener(listElement, projectId, editButton){
    

projectEditForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    
    const data = new FormData(projectForm);

    try{
        const result = await fetch(`http://localhost:3000/api/project/${projectId}`, {
            method: "PUT",
            body: data
        })
        const json = await result.json();
       

    }catch(error){
        alert("Invalid project data");
        console.error(error);
       
    }
$('#editModal').modal("toggal");
   // $('#modal fade').modal("close");


});

}


displayProjects();