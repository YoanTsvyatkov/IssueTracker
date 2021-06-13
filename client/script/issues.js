
let issueStatusList = document.querySelectorAll(".list-items");
let issues = document.querySelectorAll(".draggable");
let closeIssueButtons = document.querySelectorAll(".close-issue");
let editIssueButtons = document.querySelectorAll(".edit-issue");

let priority = document.getElementById("priority");
let input = document.querySelector(".new-task");
let assignee = document.getElementById("assignee");


let draggableIssue = null;
let editedIssueId = null;
let editedIssue = null;
let editing = false;

let users;

const projectId = localStorage.getItem("projectId");
const token = localStorage.getItem("token");

document
  .getElementById("logout-list-item")
  .addEventListener("click", function () {
    localStorage.removeItem("token");
    localStorage.removeItem("projectId");
    window.location.href = "index.html";
  });

document.getElementById("to-projects").addEventListener("click", function () {
  localStorage.removeItem("projectId");
});

if (token == null) {
  window.location.href = "index.html";
}

if (!projectId) {
  window.location.href = "project.html";
}

function errorCheck(result) {
  if (result.status == 401 || result.status == 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("projectId");
    window.location.href = "index.html";
  }
}

async function loadIssues() {
  try {
    const result = await fetch(`http://localhost:3000/api/issue/${projectId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    errorCheck(result);

    const issueList = await result.json();

    issueList.forEach((issue) => {
      createIssue(issue);
    });
  } catch (err) {

  }
}
loadIssues();

async function loadUsers() {
  try {
    const result = await fetch("http://localhost:3000/api/user", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    errorCheck(result);

    users = await result.json();

    users.forEach((user) => {
      addAssignee(user);
    });
  } catch (err) {

  }
}

loadUsers();

async function deleteIssue(issueId) {
  try {
    const result = await fetch(`http://localhost:3000/api/issue/${issueId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    errorCheck(result);
  } catch (err) {
    alert("Something went wrong");
  }
}

async function addIssue(issue) {
  try {
    const result = await fetch("http://localhost:3000/api/issue", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issue),
    });

    errorCheck(result);

    const json = await result.json();

    createIssue(json);
    
  } catch (err) {
    alert("Something went wrong");
  }
}

async function updateIssue(issue, issueId) {
  try {
    const result = await fetch(`http://localhost:3000/api/issue/${issueId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(issue),
    });

    errorCheck(result);

  } catch (err) {
    alert("Something went wrong");
  }
}

//==================================================================================================

//==============================================================
//========================Add Assignee==========================
//==============================================================

function addAssignee(user) {
  const newAssignee = document.createElement("option");
  newAssignee.value = user._id;
  newAssignee.appendChild(document.createTextNode(user.name));
  assignee.appendChild(newAssignee);
}

//==================================================================================================

//==================================================================================================
//=======================================================================================
//===================Functions related to draging/droping tasks==========================
//=======================================================================================

for (let i = 0; i < issueStatusList.length; i++) {
  issueStatusList[i].addEventListener("dragover", function (event) {
    event.preventDefault();
  });

  issueStatusList[i].addEventListener("dragenter", function () {
    dragEnter();
  });

  issueStatusList[i].addEventListener("dragleave", function () {
    dragLeave();
  });

  issueStatusList[i].addEventListener("drop", function (event) {
    event.preventDefault();
    this.appendChild(draggableIssue);
  });
}

function dragEnter() {

}

function dragLeave() {

}

//========================================================
//====================ADD ISSUE===========================
//========================================================

const addIssueButton = document.querySelector(".add-issue-button");

addIssueButton.addEventListener("click", function () {
  if (editing) {
    endEditing();
  } else {
    if (!input.value.isEmpty()) {
      addIssue(createIssueObject());
      // createIssue(createIssueObject());
      clearFields();
    }
  }
});

function createIssue(newIssue) {
  const issue = document.createElement("li");
  issue.className = "draggable";
  issue.setAttribute("draggable", true);

  /////////////////////HEADER//////////////////////////////
  const issueHeader = document.createElement("div");
  issueHeader.className = "issue-header";

  const issuePriority = document.createElement("option");
  issuePriority.className = newIssue.priority.toLowerCase();
  issuePriority.value = newIssue.priority;
  issuePriority.textContent = newIssue.priority;

  const closeButton = document.createElement("button");
  closeButton.className = "close-issue";
  closeButton.textContent = "\u00D7";

  closeButton.addEventListener("click", function () {
    let issueToBeClosed = getIssue(closeButton);
    let statusList = issueToBeClosed.parentElement;
    deleteIssue(newIssue._id);
    if (issueToBeClosed === editedIssue) {
      clearEdit();
    }
    statusList.removeChild(issueToBeClosed);
  });

  const editButton = document.createElement("button");
  editButton.className = "edit-issue";
  const editButtonPicture = document.createElement("i");
  editButtonPicture.className = "fa fa-edit";
  editButton.appendChild(editButtonPicture);

  editButton.addEventListener("click", function () {
    let issueToBeEdited = getIssue(editButton);
    editedIssueId = newIssue._id;
    startEditingIssue(issueToBeEdited);
  });

  const divButtons = document.createElement("div");
  divButtons.appendChild(editButton);
  divButtons.appendChild(closeButton);

  issueHeader.appendChild(issuePriority);
  issueHeader.appendChild(divButtons);
  /////////////////////HEADER//////////////////////////////

  //////////////////////BODY///////////////////////////////
  const issueBody = document.createElement("div");
  issueBody.appendChild(document.createTextNode(newIssue.title));
  //////////////////////BODY///////////////////////////////

  /////////////////////FOOTER//////////////////////////////
  const issueFooter = document.createElement("div");
  issueFooter.className = "issue-footer";

  const assigneeSign = document.createElement("div");
  assigneeSign.appendChild(document.createTextNode("Assignee:"));

  let assigneeId = "";
  let firstName = "Unassined";
  let lastName = "";
  if (newIssue.assignee) {
    assigneeId = newIssue.assignee.id;
    firstName = newIssue.assignee.firstName;
    lastName = newIssue.assignee.lastName;
  }

  const assignTo = document.createElement("option");
  assignTo.value = assigneeId;
  assignTo.textContent = `${firstName} ${lastName}`;

  issueFooter.appendChild(assigneeSign);
  issueFooter.appendChild(assignTo);
  /////////////////////FOOTER//////////////////////////////

  issue.appendChild(issueHeader);
  issue.appendChild(issueBody);
  issue.appendChild(issueFooter);

  //////////////////////DRAG EVENTS////////////////////////
  issue.addEventListener("dragstart", function () {
    draggableIssue = this;
  });

  issue.addEventListener("dragend", function () {
    const updatedBody = {
      status: `${issue.parentElement.id}`,
    };

    updateIssue(updatedBody, newIssue._id);

    draggableIssue = null;
  });
  //////////////////////DRAG EVENTS////////////////////////

  document.getElementById(newIssue.status).appendChild(issue);
}

function createIssueObject() {
  const name = assignee.options[assignee.selectedIndex].textContent
  const nameArray =
    assignee.options[assignee.selectedIndex].textContent.split(" ");

  if (name === "Unassigned") {
    return {
      status: "nostatus",
      title: `${input.value}`,
      priority: `${priority.value}`,
      projectId: projectId,
    };
  } else {
    return {
      status: "nostatus",
      title: `${input.value}`,
      priority: `${priority.value}`,
      projectId: projectId,
      assignee: {
        assigneeId: `${assignee.options[assignee.selectedIndex].value}`,
        firstName: `${nameArray[0]}`,
        lastName: `${nameArray[1] || ""}`,
      },  
    };
  }
}

String.prototype.isEmpty = function () {
  return this.length === 0 || !this.trim();
};

function getIssue(closeIssueButton) {
  return closeIssueButton.parentElement.parentElement.parentElement;
}

//////////////////////////////////////////////////////////////////
////////////////////////////EDITING///////////////////////////////
//////////////////////////////////////////////////////////////////

function addEditIssueHandlers() {
  for (let i = 0; i < editIssueButtons.length; i++) {
    editIssueButtons[i].addEventListener("click", function () {
      startEditingIssue(getIssue(editIssueButtons[i]));
    });
  }
}

addEditIssueHandlers();

function startEditingIssue(issue) {
  editing = true;
  editedIssue = issue;
  addIssueButton.textContent = "Edit";
  addIssueButton.style.backgroundColor = "Green";
  priority.value = getIssuePriority(editedIssue).value;
  input.value = getIssueBody(editedIssue).textContent;
  assignee.value = getAssignee(editedIssue).text;
}

function endEditing() {
  let editedIssuePriority = getIssuePriority(editedIssue);
  editedIssuePriority.value = priority.value;
  editedIssuePriority.textContent = priority.value;
  editedIssuePriority.className = priority.value.toLowerCase();

  getIssueBody(editedIssue).textContent = input.value;

  let editedIssueAssignee = getAssignee(editedIssue);
  editedIssueAssignee.value = assignee.value;
  editedIssueAssignee.textContent =
    assignee.options[assignee.selectedIndex].textContent;

  const fullName =
    assignee.options[assignee.selectedIndex].textContent.split(" ");
  let updateIssueObject;
  if (fullName[0] !== "Unassigned") {
    updateIssueObject = {
      title: `${input.value}`,
      priority: `${priority.value}`,
      assignee: {
        assigneeId: `${assignee.value}`,
        firstName: `${fullName[0]}`,
        lastName: `${fullName[1]}` || "",
      },
    };
  } else {
    updateIssueObject = {
      title: `${input.value}`,
      priority: `${priority.value}`,
    };
  }

  updateIssue(updateIssueObject, editedIssueId);

  clearEdit();
}

function clearEdit() {
  editing = false;
  addIssueButton.textContent = "Add Issue";
  addIssueButton.style.backgroundColor = "#2e2eff";
  clearFields();

  editedIssueId = null;
  editedIssue = null;
}

function clearFields() {
  input.value = "";
  priority.value = "Low";
  assignee.value = "";
}

function getIssuePriority(issue) {
  return issue.children[0].children[0];
}

function getIssueBody(issue) {
  return issue.children[1];
}

function getAssignee(issue) {
  return issue.children[2].children[1];
}
