

const myNodelist = document.getElementsByTagName("LI");
let i;
for (i = 0; i < myNodelist.length; i++) {
  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  myNodelist[i].appendChild(span);
}

const close = document.getElementsByClassName("close");
for (i = 0; i < close.length; i++) {
  close[i].onclick = function() {
    let div = this.parentElement;
    div.style.display = "none";
  }
}

function newElement() {
  const li = document.createElement("li");
  const inputValue = document.getElementById("status-input").value;
  const textValue = document.createTextNode(inputValue);
  li.appendChild(textValue);
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    document.getElementById("myUL").appendChild(li);
  }
  document.getElementById("status-input").value = "";

  let span = document.createElement("SPAN");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  li.appendChild(span);

  for (i = 0; i < close.length; i++) {
    close[i].onclick = function() {
      let div = this.parentElement;
      div.style.display = "none";
    }
  }
}


const projectForm = document.getElementById('project-form');
const projectList = document.getElementById('project-list-container');

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
            alert("Something went wrong");
        }
        
        projectList.removeChild(listElement);
    })
}

displayProjects();