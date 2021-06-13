const projectForm = document.getElementById("project-form");
const projectList = document.getElementById("project-list-container");
const token = localStorage.getItem("token");
const projectEditForm = document.getElementById("edit-form");
const modalProjectName = document.getElementById("edit-project-name");
const projectName = document.getElementById("project-name");
const projectImage = document.getElementById("project-image");

if (token == null) {
  window.location.href = "index.html";
}else{
  displayProjects();
}

//Variable that will be used when editing project
let selectedProjectId;
let selectedProjectDiv;

document
  .getElementById("logout-list-item")
  .addEventListener("click", (event) => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  });

projectForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(projectForm);

  try {
    const result = await fetch("http://localhost:3000/api/project", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    errorCheck(result);

    const newProject = await result.json();
    addProject(newProject);
    projectName.value = "";
    projectImage.value = "";
  } catch (error) {
    alert("Invalid project data");
  }
});

async function displayProjects() {
  try {
    const result = await fetch("http://localhost:3000/api/project", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    errorCheck(result);

    const projectList = await result.json();

    projectList.forEach((element) => {
      addProject(element);
    });
  } catch (err) {
    alert("Something went wrong");
  }
}

function errorCheck(result) {
  if (result.status == 401 || result.status == 403) {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  }
}

function addProject(project) {
  const newDiv = document.createElement("div");
  newDiv.id = "project-list-item";

  const projectName = document.createElement("h3");
  projectName.id = "project-list-name";
  projectName.innerHTML = project.projectName;

  const projectImage = document.createElement("img");
  projectImage.alt = "Project image";
  projectImage.setAttribute(
    "src",
    `data:image/${project.image.contentType};base64,${project.image.img}`
  );

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
  issueButton.innerHTML = "Issues";
  issueButton.className = "btn btn-light";

  const box = document.createElement("div");
  box.id = "box";
  box.appendChild(editButton);
  box.appendChild(deleteButton);
  box.appendChild(issueButton);

  newDiv.appendChild(projectName);
  newDiv.appendChild(projectImage);
  newDiv.appendChild(box);
  projectList.appendChild(newDiv);
  addDeleteProjectListener(newDiv, project.id, deleteButton);
  addEditProjectListener(editButton, newDiv, project.id);
  addOpenIssueListener(issueButton, project.id);
}

function addOpenIssueListener(issueButton, projectId) {
  issueButton.addEventListener("click", (event) => {
    localStorage.setItem("projectId", projectId);
    window.location.href = `./main-board.html`;
  });
}

function addEditProjectListener(editButton, projectDiv, projectId) {
  editButton.addEventListener("click", (event) => {
    selectedProjectId = projectId;
    modalProjectName.value = `${projectDiv.children[0].innerHTML}`;
    selectedProjectDiv = projectDiv;
  });
}

function addDeleteProjectListener(listElement, projectId, deleteButton) {
  deleteButton.addEventListener("click", async (event) => {
    try {
      const result = await fetch(
        `http://localhost:3000/api/project/${projectId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      errorCheck(result);
      projectList.removeChild(listElement);
    } catch (err) {
      alert("Something went wrong");
    }
  });
}

projectEditForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = new FormData(projectEditForm);

  try {
    const result = await fetch(
      `http://localhost:3000/api/project/${selectedProjectId}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: data,
      }
    );

    errorCheck(result);

    if (result.status == 200) {
      const json = await result.json();
      selectedProjectDiv.children[0].innerHTML = json.projectName;

      if (json.image) {
        selectedProjectDiv.children[1].setAttribute(
          "src",
          `data:image/${json.image.contentType};base64,${json.image.img}`
        );
      }
      $("#editModal").modal("toggle");
    } else {
      //TODO show form data error
      alert("Something went wrong");
    }
  } catch (error) {
    //TODO show form data error
    alert("Something went wrong");
  }
});
